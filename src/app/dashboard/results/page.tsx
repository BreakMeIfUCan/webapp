import { getUserTests } from "@/data-access/tests"
import TestResultsClient from "./test-results-client"

export default async function TestResultsPage() {
  // Fetch real data from server actions
  const tests = await getUserTests()
  
  // Transform data for display
  const testResults = tests.map(test => ({
    id: test.id,
    name: test.name,
    type: test.category,
    status: test.status,
    createdAt: test.createdAt,
    completedAt: test.completedAt,
    attackCategory: test.attackCategory || undefined,
    modelId: test.modelId || undefined,
    progress: test.progress || undefined,
    error: test.error || undefined,
    results: {
      asr: test.asr ? parseFloat(test.asr) : undefined,
      accuracy: test.accuracy ? parseFloat(test.accuracy) : undefined,
      recall: test.recall ? parseFloat(test.recall) : undefined,
      precision: test.precision ? parseFloat(test.precision) : undefined,
      f1: test.f1 ? parseFloat(test.f1) : undefined,
      latency: test.latency ? parseFloat(test.latency) : undefined,
      tokenUsage: test.tokenUsage || undefined,
      categoryWiseASR: test.categoryWiseASR,
    }
  }))

  return <TestResultsClient testResults={testResults} />
}