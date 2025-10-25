<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected $commands = [
        Commands\DemoCron::class,
        Commands\InfoprosespermCron::class,
        Commands\BackupDatabaseCron::class,
        Commands\CekbiayaCron::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('demo:cron')->everyMinute();
        // ->dailyAt();
        // $schedule->command('demo:cron')
        //     ->dailyAt('23:30');
        // $schedule->command('infoproses:cron')
        //     ->everyMinute();
        $schedule->command('infoprosesperm:cron')
            ->everyMinute();
        $schedule->command('backup-database:cron')
            ->everyFiveMinutes();
        $schedule->command('cekbiaya:cron')
            ->everyFiveMinutes();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
