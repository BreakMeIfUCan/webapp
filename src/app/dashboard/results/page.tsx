import { getUserTests } from "@/data-access/tests"
import TestResultsClient from "./test-results-client"

export default async function TestResultsPage() {
  // Fetch real data from server actions
  const tests = await getUserTests()
  
  // Transform data for display
  const testResults = tests.map(test => ({
    id: (test as any).id,
    name: (test as any).name,
    type: (test as any).category,
    status: (test as any).status,
    createdAt: (test as any).createdAt,
    completedAt: (test as any).completedAt,
    attackCategory: (test as any).attackCategory || undefined,
    modelId: (test as any).modelId || undefined,
    progress: (test as any).progress || undefined,
    error: (test as any).error || undefined,
    results: {
      asr: (test as any).asr ? parseFloat((test as any).asr) : undefined,
      accuracy: (test as any).accuracy ? parseFloat((test as any).accuracy) : undefined,
      recall: (test as any).recall ? parseFloat((test as any).recall) : undefined,
      precision: (test as any).precision ? parseFloat((test as any).precision) : undefined,
      f1: (test as any).f1 ? parseFloat((test as any).f1) : undefined,
      latency: (test as any).latency ? parseFloat((test as any).latency) : undefined,
      tokenUsage: (test as any).tokenUsage || undefined,
      categoryWiseASR: (test as any).categoryWiseASR,
    }
  }))

  return <TestResultsClient testResults={testResults} />
}