<?php

namespace App\Enums;

enum ActivityTypeEnum: string
{
    case StatusUpdate = "status_update";
    case Reviewed = "reviewed";
    case Rewatch = "rewatch";
    case CompleteReview = "complete_review";
}
