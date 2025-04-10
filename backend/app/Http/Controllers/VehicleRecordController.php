<?php

namespace App\Http\Controllers;

use App\Models\VehicleRecord;
use Illuminate\Http\Request;
use Carbon\Carbon; // Para sa date handling

class VehicleRecordController extends Controller
{
    // Function to store vehicle record (Create)
// Controller method (for example, VehicleRecordController.php)
public function store(Request $request)
{
    $request->validate([
        'pattern' => 'required|string',
        'color' => 'required|string',
        'vehicleType' => 'required|string',
        'image' => 'nullable|string',
        'user_id' => 'required|integer',
        'camera_detail' => 'nullable|string', // Add this line for camera_detail
    ]);

    $vehicleRecord = VehicleRecord::create([
        'user_id' => $request->user_id,
        'pattern' => $request->pattern,
        'color' => $request->color,
        'vehicle_type' => $request->vehicleType,
        'image' => $request->image,
        'vehicle_status' => $request->vehicle_status ?? true, // Default to `true`
        'camera_detail' => $request->camera_detail, // Save the camera detail
    ]);

    return response()->json([
        'message' => 'Vehicle record created successfully!',
        'vehicle_record' => $vehicleRecord
    ], 201);
}

    // Function to get vehicle records with pagination & search (Read)
    // Function to get vehicle records with pagination & search (Read)
public function index(Request $request, $user_id)
{
    $search = $request->query('search');
    $perPage = $request->query('per_page', 1000);
    $dateFilter = $request->query('date_filter');
    $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');
    $vehicleStatus = $request->query('vehicle_status');

    $query = VehicleRecord::where('user_id', $user_id);

    // Apply search filter
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('pattern', 'LIKE', "%{$search}%")
              ->orWhere('color', 'LIKE', "%{$search}%")
              ->orWhere('vehicle_type', 'LIKE', "%{$search}%");
        });
    }

    // Filter by vehicle status (1 o 0)
    if ($vehicleStatus !== null) {
        $query->where('vehicle_status', $vehicleStatus);
    }

    // Apply date filter (Yesterday, Today)
    if ($dateFilter) {
        if ($dateFilter == 'yesterday') {
            $query->whereDate('created_at', Carbon::yesterday()->toDateString());
        } elseif ($dateFilter == 'today') {
            $query->whereDate('created_at', Carbon::today()->toDateString());
        }
    }

    // Apply date range filter
    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    $vehicleRecords = $query->orderBy('created_at', 'desc')->paginate($perPage);

    // Count IN and OUT events dynamically for the specific user
    $counts = $this->countInOutEventsForDate($startDate, $endDate, $user_id);

    return response()->json([
        'vehicleRecords' => $vehicleRecords,
        'dateCounts' => $counts,
    ], 200);
}

// Function to count IN and OUT events but only for the specific user
private function countInOutEventsForDate($startDate, $endDate, $user_id): array
{
    $query = VehicleRecord::where('user_id', $user_id);

    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    $counts = $query->selectRaw('
        SUM(CASE WHEN vehicle_status = 1 THEN 1 ELSE 0 END) as inCount, 
        SUM(CASE WHEN vehicle_status = 0 THEN 1 ELSE 0 END) as outCount
    ')->first();

    return [
        'inCount' => $counts->inCount ?? 0,
        'outCount' => $counts->outCount ?? 0
    ];
}

    // Function to update a vehicle record (Edit)
    public function update(Request $request, $id)
    {
        $vehicleRecord = VehicleRecord::find($id);

        if (!$vehicleRecord) {
            return response()->json(['message' => 'Vehicle record not found'], 404);
        }

        $request->validate([
            'pattern' => 'required|string',
        ]);

        $vehicleRecord->pattern = $request->pattern;
        $vehicleRecord->save();

        return response()->json([
            'message' => 'Vehicle record updated successfully!',
            'vehicle_record' => $vehicleRecord
        ], 200);
    }

    // Function to delete a vehicle record (Delete)
    public function destroy($id)
    {
        $vehicleRecord = VehicleRecord::find($id);

        if (!$vehicleRecord) {
            return response()->json(['message' => 'Vehicle record not found'], 404);
        }

        $vehicleRecord->delete();

        return response()->json(['message' => 'Vehicle record deleted successfully'], 200);
    }



     public function dailyReport(Request $request, $userId)
    {
        $days = $request->query('days', 7); // Default: Last 7 days
        $startDate = Carbon::today()->subDays($days - 1);
        $endDate = Carbon::now()->endOfDay();

        // Kunin lahat ng records ng user batay sa user_id
        $records = VehicleRecord::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'asc')
            ->get();

        $groupedRecords = [];

        // Group records by date and plate_number
        foreach ($records as $record) {
            $date = Carbon::parse($record->created_at)->format('Y-m-d');
            $plate = $record->plate_number;

            $groupedRecords[$date][$plate][] = $record;
        }

        $finalReport = [];

        foreach ($groupedRecords as $date => $plates) {
            $inCount = 0;
            $outCount = 0;
            $visitorCount = 0;
            $parkCount = 0;
            $unknownCount = 0;

            foreach ($plates as $plate => $entries) {
                $inTimes = [];
                $outTimes = [];

                // Hiwalayin ang "in" at "out"
                foreach ($entries as $entry) {
                    if ($entry->vehicle_status == 1) {
                        $inTimes[] = Carbon::parse($entry->created_at);
                        $inCount++;
                    } else {
                        $outTimes[] = Carbon::parse($entry->created_at);
                        $outCount++;
                    }
                }

                // Process pairing
                while (!empty($inTimes) && !empty($outTimes)) {
                    $inTime = array_shift($inTimes);
                    $outTime = null;

                    // Hanapin ang pinaka-malapit na "out"
                    foreach ($outTimes as $key => $oTime) {
                        if ($oTime->greaterThan($inTime)) {
                            $outTime = $oTime;
                            unset($outTimes[$key]);
                            break;
                        }
                    }

                    if ($outTime) {
                        $duration = $inTime->diffInMinutes($outTime);

                        if ($duration >= 30) {
                            $parkCount++;
                        } else {
                            $visitorCount++;
                        }
                    } else {
                        $unknownCount++;
                    }
                }

                // Kapag may natitirang in o out na walang kapartner
                $unknownCount += count($inTimes) + count($outTimes);
            }

            $finalReport[] = [
                'date' => $date,
                'inCount' => $inCount,
                'outCount' => $outCount,
                'visitor' => $visitorCount,
                'park' => $parkCount,
                'unknown' => $unknownCount
            ];
        }

        return response()->json([
            'message' => 'Daily vehicle report generated successfully!',
            'report' => $finalReport
        ], 200);
    }

}
