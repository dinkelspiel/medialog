<?php
use Database\Seeders\CategorySeeder;
use Database\Seeders\EntrySeeder;
use Database\Seeders\FranchiseSeeder;
use Database\Seeders\PersonSeeder;
use Database\Seeders\StudioSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            StudioSeeder::class,
            PersonSeeder::class,
            FranchiseSeeder::class,
            EntrySeeder::class,
        ]);
    }
}
