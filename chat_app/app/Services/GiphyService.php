<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GiphyService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.giphy.com/v1/gifs';

    public function __construct()
    {
        $this->apiKey = config('services.giphy.api_key');

        if (empty($this->apiKey)) {
            Log::error('Giphy API key is not configured');
            throw new \Exception('Giphy API key is not configured');
        }
    }

    public function search(string $query, int $limit = 25, int $offset = 0): array
    {
        try{
            $response = Http::timeout(10)->get("{$this->baseUrl}/search", [
                'api_key' => $this->apiKey,
                'q' => $query,
                'limit' => $limit,
                'offset' => $offset,
                'rating' => 'g', // g, pg, pg-13, r
                'lang' => 'en',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Giphy API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return ['data' => [], 'error' => 'API request failed'];
        } catch (\Exception $e) {
            Log::error('Giphy search exception: ' . $e->getMessage());
            return ['data' => [], 'error' => $e->getMessage()];
        }
        
    }

    public function trending(int $limit = 25, int $offset = 0): array
    {
        try{
            $response = Http::timeout(10)->get("{$this->baseUrl}/trending", [
                'api_key' => $this->apiKey,
                'limit' => $limit,
                'offset' => $offset,
                'rating' => 'g',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Giphy API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return ['data' => [], 'error' => 'API request failed'];
        } catch (\Exception $e) {
            Log::error('Giphy trending exception: ' . $e->getMessage());
            return ['data' => [], 'error' => $e->getMessage()];
        }
        
    }

    public function getById(string $id): ?array
    {
        try{
            $response = Http::timeout(10)->get("{$this->baseUrl}/{$id}", [
                'api_key' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return $response->json()['data'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Giphy getById exception: ' . $e->getMessage());
            return null;
        }
        
    }
}