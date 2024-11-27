<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\ValidationException;
use Kreait\Laravel\Firebase\Facades\Firebase;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $firebaseAuth;

    public function __construct()
    {
        $this->firebaseAuth = Firebase::auth();
    }

    public function index()
    {
        //filter(Request::only('search', 'role', 'trashed'))
        // Session::flash('success', 'This is success a message!');

        $users = User::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $users = $users->orderBy(request('sortBy'), request('sortDir'));
        }
        $users = $users->filter(Request::only('search', 'role', 'trashed'))
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => UserCollection::collection($users),
        ]);
        //->with('flash', ['success' => 'sssss']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('Admin/Users/Create', [
            'roles' => collect($roles)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id]),
            'permissions' => collect($permissions)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'name' => ['required', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'min:6'],
            'roles' => ['nullable'],
            'permissions' => ['nullable']
        ]);

        $user = User::create(
            $validated
        );
        $user->syncRoles(collect($validated['roles'])->map(fn ($r) => [$r['value']]));
        $user->syncPermissions(collect($validated['permissions'])->map(fn ($r) => [$r['value']]));
        try {
            $userProperties = [
                'email' => $validated['email'],
                'emailVerified' => false,
                // 'phoneNumber' => '',
                'password' => $validated['password'],
                'displayName' => $validated['name'],
                // 'photoUrl' => null,
                'disabled' => false,
            ];
            $fb = $this->firebaseAuth->createUser($userProperties);
            $userfb = $user->userfirebase;
            $userfb->uid = $fb->uid;
            $userfb->save();

        } catch (\Kreait\Firebase\Exception\Auth\EmailExists $e) {
            throw ValidationException::withMessages(['email' => 'Email sudah digunakan']);
        }
        return to_route('admin.users.index')->with('success', 'User created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $roles = Role::all();
        $permissions = Permission::all();
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'userRoles' => $user->roles,
            'userPermissions' => $user->permissions,
            'roles' => collect($roles)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id]),
            'permissions' => collect($permissions)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id]),
        ]);
    }

    public function pesan(User $user)
    {
        $roles = Role::all();
        $permissions = Permission::all();
        return Inertia::render('Admin/Users/Pesan', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(User $user, Request $request)
    {

        $validated =  request()->validate([
            'name' => ['required', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'roles' => ['nullable'],
            'permissions' => ['nullable']
        ]);

        $user->update(
            $validated
        );
        $user->syncRoles(collect($validated['roles'])->map(fn ($r) => [$r['value']]));
        $user->syncPermissions(collect($validated['permissions'])->map(fn ($r) => [$r['value']]));

        return Redirect::route('admin.users.index')->with('success', 'User updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return Redirect::back()->with('success', 'User deleted.');
    }

    public function userList(Request $request)
    {
        // $results = Pembayaranppat::select('pembayaranppats.*', 'kegiatankas.nama_kegiatan', 'jumlah', 'kode_akun')
        //     ->join('kegiatankas', 'pembayaranppats.kegiatankas_id', 'kegiatankas.id')
        //     ->join('akuns', 'kegiatankas.akun_debet', 'akuns.id')->skip(0)->take(100)->get();
        $results = User::where('name', 'like', '%' . request()->get('query', '') . '%')->skip(0)->take(20)->get();
        return Response()->json($results);
    }
}
