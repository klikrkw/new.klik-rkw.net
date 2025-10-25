<?php

namespace App\Console\Commands;

use App\Traits\UtilTrait;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
class BackupDatabaseCron extends Command
{
use UtilTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup-database:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    public function handle()
    {
        // Log::info(env('DB_PASSWORD'));
        // $table_name = 'transpermohonans';
        // $date = Carbon::now()->subDay(1);
        $date = Carbon::now()->subDays(7);
        $deletefile = $this->deleteFilesByDate($date);
        $filename = "backup-" . now()->format('Y-m-d_His').".gz";
        // $filename = "backup-" . now()->format('Y-m-d_His').".sql";
        $command = "mysqldump --user=" . env('DB_USERNAME') ." --password=" . env('DB_PASSWORD') . " --host=" . env('DB_HOST') . " " . env('DB_DATABASE') . " | gzip > ".storage_path("app/backup/" . $filename);
        // $command = "mysqldump --user=" . env('DB_USERNAME') ." --password=" . env('DB_PASSWORD') . " --host=" . env('DB_HOST') . " " . env('DB_DATABASE')
        // . " " . $table_name . " --single-transaction --no-create-info --no-create-db --where="."DATE\\(created_at\\)\\>\\=\\'2024-12-31\\'"." > ".storage_path("app/backup/" . $filename);
        $returnVar = NULL;
        $output = NULL;
        exec($command, $output, $returnVar);
        Log::info("Backup created: " . $deletefile);
    }

}
