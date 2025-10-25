<?php

namespace App\Traits;
use App\Models\UserFirebase;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Kreait\Firebase\Messaging\CloudMessage;

trait UtilTrait {
public function deleteFilesByDate($date, $dir="backup")
{
    // Define the directory where files are stored

    // Get all files in the directory
    $files = Storage::files($dir);
    $dt =null;
    foreach ($files as $file) {
        // Extract the file's last modified time
        $lastModified = Storage::lastModified($file);

        // Convert the specific date to a timestamp
        $dt = Carbon::parse($date);
        // Compare and delete if the file matches the specific date
        // if (date('Y-m-d', $lastModified) === date('Y-m-d', $specificDate)) {
        if(Carbon::parse($lastModified)->lte($date)){
        // if (date('Y-m-d', $lastModified) === date('Y-m-d', $specificDate)) {
            Storage::delete($file);
        }
    }
    return $dt;
}
}
