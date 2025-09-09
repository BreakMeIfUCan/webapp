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
    id: test.id,
    name: test.name,
    type: test.category,
    status: test.status,
    createdAt: test.createdAt,
    completedAt: test.completedAt,
    attackCategory: test.attackCategory || undefined,
    modelId: test.modelId || undefined,
    description: test.description || undefined,
    progress: test.progress || undefined,
    error: test.error || undefined,
    defenseType: test.defenseType || undefined,
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
  }

  return <TestResultClient testData={testData} />
}