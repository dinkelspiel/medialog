<?php

namespace App\Enums;

// 'Created', 'Updated', 'Rating', 'A-Z'

enum SortAfterEnum:string {
    case Created = 'Created';
    case Updated = 'Updated';
    case Rating = 'Rating';
    case AZ = 'A-Z';
}
