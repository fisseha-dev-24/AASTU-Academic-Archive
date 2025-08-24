<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentReview;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentReviewController extends Controller
{
    // Single review
    public function review(Request $request, Document $document)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'comment' => 'nullable|string',
        ]);

        $review = DocumentReview::updateOrCreate(
            [
                'document_id' => $document->id,
                'reviewer_id' => Auth::id(),
            ],
            [
                'status' => $request->status,
                'comment' => $request->comment,
                'reviewed_at' => now(),
            ]
        );

        // Log approval/rejection
        AuditLog::create([
            'user_id'     => Auth::id(),
            'document_id' => $document->id,
            'action'      => 'review',
            'details'     => "Document {$request->status} by " . Auth::user()->name,
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review
        ]);
    }

    // Bulk review
    public function bulkReview(Request $request)
    {
        $request->validate([
            'document_ids' => 'required|array',
            'document_ids.*' => 'exists:documents,id',
            'status' => 'required|in:approved,rejected',
            'comment' => 'nullable|string',
        ]);

        $reviews = [];

        foreach ($request->document_ids as $docId) {
            $reviews[] = DocumentReview::updateOrCreate(
                [
                    'document_id' => $docId,
                    'reviewer_id' => Auth::id(),
                ],
                [
                    'status' => $request->status,
                    'comment' => $request->comment,
                    'reviewed_at' => now(),
                ]
            );

            // Log each bulk approval/rejection
            AuditLog::create([
                'user_id'     => Auth::id(),
                'document_id' => $docId,
                'action'      => 'review',
                'details'     => "Document {$request->status} in bulk by " . Auth::user()->name,
                'ip_address'  => $request->ip(),
            ]);
        }

        return response()->json([
            'message' => 'Bulk review completed.',
            'reviews' => $reviews
        ]);
    }
}
