export type CaptureMode = 'free' | 'mission';
export type EraStatus = 'not_started' | 'in_progress' | 'decoded';
export type FreeVerdict = 'accepted' | 'retake_required' | 'unidentified' | 'out_of_scope';
export type MissionVerdict = 'completed' | 'retake_required' | 'unidentified' | 'not_matched';
export type EvaluationVerdict = FreeVerdict | MissionVerdict;
export type Era = {
  id: string;
  name: string;
  period: string;
  status: EraStatus;
  fragmentCount: number;
  fragmentGoal: number;
};
export type MockUser = { id: string; displayName: string };
export type FeedPost = { id: string; authorName: string; subjectName: string; caption: string };

export type Coordinates = { latitude: number; longitude: number };
export type Mission = {
  id: string;
  version: number;
  eraId: string;
  eraName: string;
  placeId: string;
  placeName: string;
  address: string;
  location: Coordinates;
  clue: string;
  hints: string[];
  photoRequirements: string[];
  distanceMeters: number;
  xp: number;
  revealedHints: number;
  answerRevealed: boolean;
};
export type MissionSearchStage = 'finding' | 'reviewing' | 'preparing';
export type MissionSearchInput = {
  location: Coordinates;
  radiusMeters: number;
  eraId?: string;
  excludePlaceId?: string;
  scenario?: 'success' | 'empty' | 'error';
};
export type MissionSearchResult =
  { status: 'ready'; mission: Mission } | { status: 'no_suitable_place' };

export type CapturedPhoto = { uri: string; width: number; height: number };
export type CaptureScenario =
  'success' | 'retake_required' | 'unidentified' | 'out_of_scope' | 'not_matched' | 'service_error';
export type CaptureDraft = {
  id: string;
  sessionId: string;
  ownerId: string;
  mode: CaptureMode;
  mission: Mission | null;
  photo: CapturedPhoto;
  evidence: CapturedPhoto[];
  scenario: CaptureScenario;
};
export type CaptureAssessment = {
  verdict: EvaluationVerdict;
  name: string;
  knowledge: string;
  instruction: string;
  subjectKey: string;
  eraId: string | null;
};
export type CaptureRecord = CaptureAssessment & {
  id: string;
  sessionId: string;
  ownerId: string;
  mode: CaptureMode;
  photo: CapturedPhoto;
  missionId: string | null;
  xp: number;
  fragmentAdded: boolean;
  createdAt: string;
};
