<?php

namespace App\Http\Controllers;

use App\Models\Franchise;
use Illuminate\Http\Request;

class FranchiseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $franchises = Franchise::where('name', '!=', 'null');

        if($request->get('q'))
        {
            $franchises = $franchises->where("name", "LIKE", "%" . $request->get('q') . "%");
        }

        if($request->get('limit'))
        {
            $franchises = $franchises->limit($request->get('limit'));
        }

        $franchises = $franchises->with(["category", "entries.creators"]);

        return response()->json($franchises->get()->map(function ($franchise) {
            return [
                'id' => $franchise->id,
                'name' => $franchise->name,
                'category' => $franchise->category->name,
                'creators' => $franchise->entries->flatMap(function ($entry) {return $entry->creators;})->pluck('name')->unique()->values(),
                'entries' => $franchise->entries->map(function ($entry) {
                    return [
                        'name' => $entry->name,
                        'coverUrl' => $entry->cover_url, 
                        'length' => $entry->length,
                        'creators' => $entry->creators->map(function ($creator) {
                            return ['name' => $creator->name];
                        })
                    ];
                })
            ];
        } ));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Franchise $franchise)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Franchise $franchise)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Franchise $franchise)
    {
        //
    }
}
