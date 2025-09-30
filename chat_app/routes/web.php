<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;


Route::middleware(['auth','blocked'])->group(function () {
Route::get('/', [HomeController::class, 'home'])->name('dashboard');});
 
//Route::middleware('auth')->group(function(){Route::get('/profile')})
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';