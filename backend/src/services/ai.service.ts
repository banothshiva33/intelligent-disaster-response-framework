import { env } from '../config/env';

export type SeverityPrediction = {
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  source: 'local' | 'remote';
  explanation: string;
};

const getLocalSeverity = (input: string, evidenceCount = 1): SeverityPrediction => {
  const normalized = input.toLowerCase();
  const highKeywords = ['fire', 'explosion', 'earthquake', 'tsunami', 'storm', 'collapse', 'flood', 'evacuation', 'gas leak', 'chemical'];
  const mediumKeywords = ['traffic', 'power', 'landslide', 'road blockage', 'crack', 'waterlogging', 'medical'];

  let score = 0;
  if (evidenceCount > 1) score += 1;
  if (evidenceCount > 3) score += 1;

  const keywordMatches = [...highKeywords, ...mediumKeywords].filter((keyword) => normalized.includes(keyword));
  if (keywordMatches.some((keyword) => highKeywords.includes(keyword))) score += 3;
  else if (keywordMatches.some((keyword) => mediumKeywords.includes(keyword))) score += 2;

  if (normalized.includes('urgent') || normalized.includes('emergency')) score += 2;
  if (normalized.includes('injured') || normalized.includes('trapped')) score += 2;

  const severity = score >= 6 ? 'High' : score >= 3 ? 'Medium' : 'Low';
  const confidence = severity === 'High' ? 0.9 : severity === 'Medium' ? 0.76 : 0.68;

  return {
    severity,
    confidence: Number(confidence.toFixed(2)),
    source: 'local',
    explanation: `Rule-based severity assessment using incident text, keyword intensity, and evidence quantity.`
  };
};

export const predictIncidentSeverity = async ({
  title,
  description,
  incidentType,
  evidenceCount = 1
}: {
  title: string;
  description: string;
  incidentType?: string;
  evidenceCount?: number;
}): Promise<SeverityPrediction> => {
  const text = `${title} ${description} ${incidentType ?? ''}`;

  if (!env.AI_SERVICE_URL) {
    return getLocalSeverity(text, evidenceCount);
  }

  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/predict-severity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, incidentType, evidenceCount })
    });

    if (!response.ok) {
      throw new Error(`AI service responded with ${response.status}`);
    }

    const payload = await response.json() as Partial<SeverityPrediction> & { severity?: string };

    if (payload.severity && ['Low', 'Medium', 'High'].includes(payload.severity)) {
      return {
        severity: payload.severity as 'Low' | 'Medium' | 'High',
        confidence: Number((payload.confidence ?? 0.75).toFixed(2)),
        source: 'remote',
        explanation: payload.explanation ?? 'Remote AI severity prediction.'
      };
    }
  } catch (_error) {
    // fallback to rule-based local predictor when AI service is unavailable.
  }

  return getLocalSeverity(text, evidenceCount);
};
