<?php

namespace App\Enums;

enum ActivityTypeEnum: string
{
    case StatusUpdate = "status_update";
    case Reviewed = "reviewed";
    case Rewatch = "rewatch";
}
