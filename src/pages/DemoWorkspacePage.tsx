import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useDemoContext, EnquiryRecord, ViewingRequest } from '../context/DemoContext';
import { VERIFIED_TEAM } from '../data/gnsData';

export const DemoWorkspacePage: React.FC = () => {
  const {
    properties,
    enquiries,
    viewings,
    propertyOverrides,
    updateEnquiryStatus,
    updateViewingStatus,
    assignAdvisorToEnquiry,
    addEnquiryNote,
    updatePropertyOverride,
    resetPropertyOverride,
    resetDemoData,
    exportCSV,
  } = useDemoContext();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'viewings' | 'overrides'>('enquiries');
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  // Selected enquiry for notes view
  const selectedEnquiry = enquiries.find((e) => e.id === selectedEnquiryId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryId || !newNote.trim()) return;
    addEnquiryNote(selectedEnquiryId, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="w-full bg-[#F5F4F0] py-10 sm:py-14 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Header Banner */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D6A536]/15 border border-[#D6A536] text-[#202020] px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#D6A536]" />
                <span>Internal Client Demo Environment</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#202020]">
                GNS Operations & Overseer Workspace
              </h1>
              <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
                Review submitted client inquiries, viewing requests, advisor assignments, and live property overrides. Data persists locally in browser storage.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => exportCSV('enquiries')}
                type="button"
                className="inline-flex items-center gap-1.5 bg-[#F5F4F0] hover:bg-[#E8E5DE] text-[#202020] border border-[#E8E5DE] px-3.5 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors"
                title="Export Enquiries CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#D6A536]" />
                <span>Export Enquiries CSV</span>
              </button>

              <button
                onClick={() => exportCSV('viewings')}
                type="button"
                className="inline-flex items-center gap-1.5 bg-[#F5F4F0] hover:bg-[#E8E5DE] text-[#202020] border border-[#E8E5DE] px-3.5 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors"
                title="Export Viewings CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#D6A536]" />
                <span>Export Viewings CSV</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all demo inquiries, viewings, and property overrides to sample initial data?')) {
                    resetDemoData();
                  }
                }}
                type="button"
                className="inline-flex items-center gap-1.5 bg-[#D6A536] hover:bg-[#B98722] text-[#202020] px-3.5 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
                title="Reset to Sample Initial Data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E5DE] mb-6">
          <button
            onClick={() => setActiveTab('enquiries')}
            type="button"
            className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold transition-colors border-b-2 ${
              activeTab === 'enquiries'
                ? 'border-[#D6A536] text-[#202020] bg-white rounded-t-md'
                : 'border-transparent text-[#666666] hover:text-[#202020]'
            }`}
          >
            Enquiries Register ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('viewings')}
            type="button"
            className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold transition-colors border-b-2 ${
              activeTab === 'viewings'
                ? 'border-[#D6A536] text-[#202020] bg-white rounded-t-md'
                : 'border-transparent text-[#666666] hover:text-[#202020]'
            }`}
          >
            Viewing Appointments ({viewings.length})
          </button>

          <button
            onClick={() => setActiveTab('overrides')}
            type="button"
            className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold transition-colors border-b-2 ${
              activeTab === 'overrides'
                ? 'border-[#D6A536] text-[#202020] bg-white rounded-t-md'
                : 'border-transparent text-[#666666] hover:text-[#202020]'
            }`}
          >
            Property Overrides ({Object.keys(propertyOverrides).length})
          </button>
        </div>

        {/* Tab 1: Enquiries Register */}
        {activeTab === 'enquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white border border-[#E8E5DE] rounded-lg overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#E8E5DE] bg-[#F5F4F0] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#202020] uppercase tracking-wider">
                  Logged Client Mandates
                </span>
                <span className="text-xs text-[#666666]">{enquiries.length} total records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#202020] text-white uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Property / Mandate</th>
                      <th className="p-3">Channel & Timeline</th>
                      <th className="p-3">Assigned Advisor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DE]">
                    {enquiries.map((enq) => (
                      <tr
                        key={enq.id}
                        className={`hover:bg-[#F5F4F0] transition-colors ${
                          selectedEnquiryId === enq.id ? 'bg-[#F5F4F0]' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-semibold text-[#202020]">{enq.name}</div>
                          <div className="text-[11px] text-[#666666]">{enq.email}</div>
                          <div className="text-[11px] font-mono text-[#666666]">{enq.phone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-[#202020] max-w-[150px] truncate">
                            {enq.propertyTitle || 'General Advisory'}
                          </div>
                          <div className="text-[10px] text-[#666666] mt-0.5">{enq.createdAt}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 text-[10px] bg-[#F5F4F0] text-[#202020] border border-[#E8E5DE] rounded-sm font-medium">
                            {enq.preferredContact}
                          </span>
                          <div className="text-[10px] text-[#666666] mt-1">{enq.timeline}</div>
                        </td>
                        <td className="p-3">
                          <select
                            value={enq.advisorAssigned}
                            onChange={(e) => assignAdvisorToEnquiry(enq.id, e.target.value)}
                            className="bg-[#F5F4F0] border border-[#E8E5DE] p-1 text-[11px] text-[#202020] rounded-sm"
                          >
                            {VERIFIED_TEAM.map((t) => (
                              <option key={t.id} value={t.name}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value as EnquiryRecord['status'])
                            }
                            className={`p-1 text-[11px] font-semibold border rounded-sm ${
                              enq.status === 'Closed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : enq.status === 'Viewing Scheduled'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-[#F5F4F0] text-[#202020] border-[#E8E5DE]'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="In Contact">In Contact</option>
                            <option value="Viewing Scheduled">Viewing Scheduled</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedEnquiryId(enq.id)}
                            type="button"
                            className="text-[11px] font-semibold text-[#D6A536] hover:text-[#B98722]"
                          >
                            Notes ({enq.notes.length})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes Sidebar */}
            <div className="lg:col-span-4 bg-white border border-[#E8E5DE] rounded-lg p-6 shadow-xs">
              <h3 className="font-serif text-lg text-[#202020] font-semibold border-b border-[#E8E5DE] pb-3 mb-4 flex items-center justify-between">
                <span>Advisory Log</span>
                {selectedEnquiry && (
                  <span className="text-xs font-mono text-[#666666]">{selectedEnquiry.id}</span>
                )}
              </h3>

              {selectedEnquiry ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase text-[#666666] block">Client Message</span>
                    <p className="text-xs text-[#202020] bg-[#F5F4F0] p-3 border border-[#E8E5DE] rounded-sm mt-1 leading-relaxed">
                      "{selectedEnquiry.message}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#666666] block mb-2">History</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedEnquiry.notes.map((note, idx) => (
                        <div key={idx} className="p-2.5 bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm text-xs text-[#202020]">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-[#E8E5DE]">
                    <label className="block text-[10px] uppercase text-[#666666] font-semibold">
                      Add Advisor Log Entry
                    </label>
                    <textarea
                      rows={2}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="e.g. Conducted consultation, sent brochure..."
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm p-2 text-xs focus:outline-none focus:border-[#D6A536]"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="w-full bg-[#202020] hover:bg-[#D6A536] hover:text-[#202020] disabled:opacity-50 text-white py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Save Note to Record
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-xs text-[#666666] italic py-8 text-center">
                  Select an inquiry from the table to view conversation history and add internal notes.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Viewing Appointments */}
        {activeTab === 'viewings' && (
          <div className="bg-white border border-[#E8E5DE] rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8E5DE] bg-[#F5F4F0] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#202020] uppercase tracking-wider">
                Scheduled Private Itineraries
              </span>
              <span className="text-xs text-[#666666]">{viewings.length} total appointments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202020] text-white uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Appointment ID</th>
                    <th className="p-3">Target Property</th>
                    <th className="p-3">Client Contact</th>
                    <th className="p-3">Format & Date</th>
                    <th className="p-3">Advisor Assigned</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E5DE]">
                  {viewings.map((vw) => (
                    <tr key={vw.id} className="hover:bg-[#F5F4F0] transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#666666]">{vw.id}</td>
                      <td className="p-3 font-semibold text-[#202020]">{vw.propertyTitle}</td>
                      <td className="p-3">
                        <div className="font-medium text-[#202020]">{vw.clientName}</div>
                        <div className="text-[11px] text-[#666666]">{vw.clientEmail}</div>
                        <div className="text-[11px] font-mono text-[#666666]">{vw.clientPhone}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#202020]">{vw.viewingType}</div>
                        <div className="text-[11px] text-[#666666]">
                          {vw.preferredDate} at {vw.preferredTime}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[#202020] font-medium">{vw.advisorAssigned}</span>
                      </td>
                      <td className="p-3">
                        <select
                          value={vw.status}
                          onChange={(e) =>
                            updateViewingStatus(vw.id, e.target.value as ViewingRequest['status'])
                          }
                          className="bg-[#F5F4F0] border border-[#E8E5DE] p-1 text-[11px] font-medium rounded-sm"
                        >
                          <option value="Pending Confirmation">Pending Confirmation</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Rescheduled">Rescheduled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Property Overrides */}
        {activeTab === 'overrides' && (
          <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#E8E5DE] pb-4 mb-6">
              <h2 className="font-serif text-2xl text-[#202020] font-semibold">
                Live Property Overrides
              </h2>
              <p className="text-xs text-[#666666] mt-1">
                Edit pricing notes, titles, or status in real time. Changes reflect immediately across all pages.
              </p>
            </div>

            <div className="space-y-6">
              {properties.map((prop) => {
                const hasOverride = !!propertyOverrides[prop.id];

                return (
                  <div
                    key={prop.id}
                    className={`p-5 rounded-lg border transition-colors ${
                      hasOverride
                        ? 'border-[#D6A536] bg-[#F5F4F0]'
                        : 'border-[#E8E5DE] bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#D6A536] font-semibold">
                            {prop.developer}
                          </span>
                          {hasOverride && (
                            <span className="bg-[#D6A536] text-[#202020] px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider">
                              Override Active
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-lg text-[#202020] font-semibold mt-0.5">
                          {prop.title}
                        </h3>
                      </div>

                      {hasOverride && (
                        <button
                          onClick={() => resetPropertyOverride(prop.id)}
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset to Default</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase text-[#666666] font-semibold mb-1">
                          Display Title
                        </label>
                        <input
                          type="text"
                          value={prop.title}
                          onChange={(e) =>
                            updatePropertyOverride(prop.id, { title: e.target.value })
                          }
                          className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm p-2 text-xs text-[#202020]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#666666] font-semibold mb-1">
                          Pricing Note
                        </label>
                        <input
                          type="text"
                          value={prop.pricingNote}
                          onChange={(e) =>
                            updatePropertyOverride(prop.id, { pricingNote: e.target.value })
                          }
                          className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm p-2 text-xs text-[#202020]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#666666] font-semibold mb-1">
                          Status
                        </label>
                        <select
                          value={prop.status}
                          onChange={(e) =>
                            updatePropertyOverride(prop.id, {
                              status: e.target.value as any,
                            })
                          }
                          className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm p-2 text-xs text-[#202020]"
                        >
                          <option value="Ready">Ready</option>
                          <option value="Off-Plan">Off-Plan</option>
                          <option value="Handover 2026">Handover 2026</option>
                          <option value="Handover 2027">Handover 2027</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
