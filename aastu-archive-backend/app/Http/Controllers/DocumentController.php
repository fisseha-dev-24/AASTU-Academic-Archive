<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    /**
     * Store a new document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'author'         => 'nullable|string|max:255',
            'department_id'  => 'required|exists:departments,id',
            'document_type'  => 'required|string|max:50',
            'year'           => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'file'           => 'required|mimes:pdf,docx,mp4|max:10240', // 10MB
        ]);

        $path = $request->file('file')->store('documents', 'public');

        $doc = Document::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'author'        => $request->author,
            'department_id' => $request->department_id,
            'document_type' => $request->document_type,
            'year'          => $request->year,
            'file_path'     => $path,
            'user_id'       => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $doc
        ], 201);
    }

    /**
     * List & filter documents
     */
    public function index(Request $request)
    {
        $query = Document::with(['user', 'department']);

        // Filtering
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        // Sorting
        if ($request->filled('sort_by')) {
            $sortField = $request->sort_by; // e.g. created_at, year
            $sortOrder = $request->get('order', 'desc'); // default desc
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc'); // default sorting
        }

        // Pagination (10 per page)
        $documents = $query->paginate(10);

        // Response formatting
        return response()->json([
            'data' => $documents->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'year' => $doc->year,
                    'document_type' => $doc->document_type,
                    'department' => $doc->department->name ?? null,
                    'uploaded_by' => $doc->user->name ?? null,
                    'created_at' => $doc->created_at->toDateTimeString(),
                ];
            }),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page'    => $documents->lastPage(),
                'total'        => $documents->total(),
            ]
        ]);
    }
}
