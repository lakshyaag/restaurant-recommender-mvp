/**
 * Client profile form dropdown options
 * 
 * These constants are used in the client profile form and the API
 * endpoint that processes client profiles.
 */

// Client designation options
export const CLIENT_DESIGNATIONS = [
  {
    value: "C-Suite",
    label: "C-Suite (CEO, CFO, CTO, etc.)"
  },
  {
    value: "SVP/VP Level",
    label: "SVP/VP Level"
  },
  {
    value: "Director/Manager",
    label: "Director/Manager"
  },
  {
    value: "Technical/Specialist",
    label: "Technical/Specialist"
  },
  {
    value: "Mixed",
    label: "Mixed group"
  }
] as const;

// Meeting purpose options
export const MEETING_PURPOSES = [
  {
    value: "Introduction",
    label: "First Introduction"
  },
  {
    value: "Check-in",
    label: "Regular Check-in"
  },
  {
    value: "Milestone",
    label: "Project Milestone"
  },
  {
    value: "Negotiation",
    label: "Contract Negotiation"
  },
  {
    value: "Celebration",
    label: "Celebration"
  },
  {
    value: "Other",
    label: "Other"
  }
] as const;

// Meeting duration options
export const MEETING_DURATIONS = [
  {
    value: "30min",
    label: "30 minutes"
  },
  {
    value: "1hour",
    label: "1 hour"
  },
  {
    value: "1.5hours",
    label: "1.5 hours"
  },
  {
    value: "2hours",
    label: "2 hours"
  },
  {
    value: "2.5hours+",
    label: "2.5+ hours"
  }
] as const;

// Relationship status options
export const RELATIONSHIP_STATUSES = [
  {
    value: "New",
    label: "New prospect"
  },
  {
    value: "Existing-New",
    label: "Existing client (less than 1 year)"
  },
  {
    value: "Existing-Long",
    label: "Long-term client (1+ years)"
  }
] as const;

// Type definitions
export type ClientDesignation = typeof CLIENT_DESIGNATIONS[number]['value'];
export type MeetingPurpose = typeof MEETING_PURPOSES[number]['value'];
export type MeetingDuration = typeof MEETING_DURATIONS[number]['value'];
export type RelationshipStatus = typeof RELATIONSHIP_STATUSES[number]['value']; 