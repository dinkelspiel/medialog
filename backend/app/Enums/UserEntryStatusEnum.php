<?php

namespace App\Enums;

enum UserEntryStatusEnum: string
{
    case Planning = "planning";
    case Watching = "watching";
    case DNF = "dnf";
    case Paused = "paused";
    case Completed = "completed";
}
