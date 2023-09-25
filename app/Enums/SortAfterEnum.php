<?php

namespace App\Enums;

// 'Created', 'Updated', 'Rating', 'A-Z'

enum SortAfterEnum:string {
    case Watched = 'Watched';
    case Updated = 'Updated';
    case Rating = 'Rating';
    case AZ = 'A-Z';
}
