<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleCollection;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $roles = $roles->orderBy(request('sortBy'), request('sortDir'));
        }
        $roles = $roles->with('permissions')
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Roles/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'roles' => RoleCollection::collection($roles),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // collect($roles)->map(
        //     function ($r) {
        //         return ['label' => $r, 'value' => $r];
        //     }
        // )
        $permissions = Permission::all();


        return Inertia::render(
            'Admin/Roles/Create',
            ['permissions' => collect($permissions)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'name' => ['required', 'unique:roles,name'],
            'permissions' => ['nullable']
        ]);

        $role = Role::create(
            $validated
        );

        $role->syncPermissions(collect($validated['permissions'])->map(fn ($r) => [$r['value']]));

        return redirect()->route('admin.roles.index')->with('success', 'role created.');
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
    public function edit(role $role)
    {
        $permissions = Permission::all();
        return Inertia::render('Admin/Roles/Edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions,
            'permissions' => collect($permissions)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, role $role)
    {
        $validated =  request()->validate([
            'name' => ['required', Rule::unique(Role::class)->ignore($role->id)],
            'permissions' => ['nullable']
        ]);

        $role->update($validated);
        $role->syncPermissions(collect($validated['permissions'])->map(fn ($r) => [$r['value']]));

        return to_route('admin.roles.index')->with('success', 'role Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(role $role)
    {
        $role->delete();
        return Redirect::back()->with('success', 'role deleted.');
    }
}
