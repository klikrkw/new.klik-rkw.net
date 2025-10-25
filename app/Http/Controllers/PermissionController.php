<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionCollection;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::query();
        if (request()->has(['sortBy', 'sortDir'])) {
            $permissions = $permissions->orderBy(request('sortBy'), request('sortDir'));
        }
        $permissions = $permissions->with('roles')
            ->paginate(10)
            ->appends(Request::all());

        return Inertia::render('Admin/Permissions/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'permissions' => PermissionCollection::collection($permissions),
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
        $roles = Role::all();


        return Inertia::render(
            'Admin/Permissions/Create',
            ['roles' => collect($roles)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =  request()->validate([
            'name' => ['required', 'unique:permissions,name'],
            'roles' => ['nullable']
        ]);

        $permission = Permission::create(
            $validated
        );

        $permission->syncRoles(collect($validated['roles'])->map(fn ($r) => [$r['value']]));

        return redirect()->route('admin.permissions.index')->with('success', 'Permission created.');
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
    public function edit(Permission $permission)
    {
        $roles = Role::all();
        return Inertia::render('Admin/Permissions/Edit', [
            'permission' => $permission,
            'permissionRoles' => $permission->roles,
            'roles' => collect($roles)->map(fn ($o) => ['label' => $o->name, 'value' => $o->id])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated =  request()->validate([
            'name' => ['required', Rule::unique(Permission::class)->ignore($permission->id)],
            'roles' => ['nullable']
        ]);

        $permission->update($validated);
        $permission->syncRoles(collect($validated['roles'])->map(fn ($r) => [$r['value']]));

        return to_route('admin.permissions.index')->with('success', 'Permission Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();
        return Redirect::back()->with('success', 'Permission deleted.');
    }
}
