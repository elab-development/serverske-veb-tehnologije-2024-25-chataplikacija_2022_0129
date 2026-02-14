<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GiphyService;

class GiphyController extends Controller
{
    private GiphyService $giphyService;

    public function __construct(GiphyService $giphyService)
    {
        $this->giphyService = $giphyService;
    }

    public function search(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string|max:100',
                'limit' => 'integer|min:1|max:50',
                'offset' => 'integer|min:0',
            ]);

            $results = $this->giphyService->search(
                $request->query('query'),
                $request->query('limit', 25),
                $request->query('offset', 0)
            );

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Giphy search error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to search GIFs',
                'message' => $e->getMessage()
            ], 500);
        }
        
    }

    public function trending(Request $request)
    {
        try{
            $request->validate([
                'limit' => 'integer|min:1|max:50',
                'offset' => 'integer|min:0',
            ]);

            $results = $this->giphyService->trending(
                $request->query('limit', 25),
                $request->query('offset', 0)
            );

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Giphy trending error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to load trending GIFs',
                'message' => $e->getMessage()
            ], 500);

        }
        
    }

    public function show(string $id)
    {
        try{
            $gif = $this->giphyService->getById($id);

            if (!$gif) {
                return response()->json(['message' => 'GIF not found'], 404);
            }

            return response()->json(['data' => $gif]);
        } catch (\Exception $e) {
            Log::error('Giphy show error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to load GIF',
                'message' => $e->getMessage()
            ], 500);
        }
        
    }
}
