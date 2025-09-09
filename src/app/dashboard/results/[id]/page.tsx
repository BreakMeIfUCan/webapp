import { getTestById } from "@/data-access/tests"
import { notFound } from "next/navigation"
import TestResultClient from "./test-result-client"

interface TestResultPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TestResultPage({ params }: TestResultPageProps) {
  // Await params before using its properties
  const { id } = await params
  
  // Fetch real data from server actions
  const test = await getTestById(id)
  
  if (!test) {
    notFound()
  }
  
  // Transform data for display
  const testData = {
    id: (test as any).id,
    name: (test as any).name,
    type: (test as any).category,
    status: (test as any).status,
    createdAt: (test as any).createdAt,
    completedAt: (test as any).completedAt,
    attackCategory: (test as any).attackCategory || undefined,
    modelId: (test as any).modelId || undefined,
    curlEndpoint: (test as any).curlEndpoint || undefined,
    description: (test as any).description || undefined,
    progress: (test as any).progress || undefined,
    error: (test as any).error || undefined,
    defenseType: (test as any).defenseType || undefined,
    results: {
      asr: (test as any).asr ? parseFloat((test as any).asr) : undefined,
      accuracy: (test as any).accuracy ? parseFloat((test as any).accuracy) : undefined,
      recall: (test as any).recall ? parseFloat((test as any).recall) : undefined,
      precision: (test as any).precision ? parseFloat((test as any).precision) : undefined,
      f1: (test as any).f1 ? parseFloat((test as any).f1) : undefined,
      latency: (test as any).latency ? parseFloat((test as any).latency) : undefined,
      tokenUsage: (test as any).tokenUsage || undefined,
      categoryWiseASR: (test as any).categoryWiseASR,
      // Defense results
      defenseASR: (test as any).defenseASR ? parseFloat((test as any).defenseASR) : undefined,
      defenseAccuracy: (test as any).defenseAccuracy ? parseFloat((test as any).defenseAccuracy) : undefined,
      defenseRecall: (test as any).defenseRecall ? parseFloat((test as any).defenseRecall) : undefined,
      defensePrecision: (test as any).defensePrecision ? parseFloat((test as any).defensePrecision) : undefined,
      defenseF1: (test as any).defenseF1 ? parseFloat((test as any).defenseF1) : undefined,
      defenseLatency: (test as any).defenseLatency ? parseFloat((test as any).defenseLatency) : undefined,
      defenseTokenUsage: (test as any).defenseTokenUsage || undefined,
      defenseCategoryWiseASR: (test as any).defenseCategoryWiseASR,
    }
  }

  return <TestResultClient testData={testData} />
}