import { notFound } from "next/navigation"
import { getTestById } from "@/data-access/tests"
import TestComparisonClient from "./test-comparison-client"

interface TestComparisonPageProps {
  params: Promise<{ id: string }>
}

export default async function TestComparisonPage({ params }: TestComparisonPageProps) {
  const { id } = await params
  
  // Fetch real data from server actions
  const test = await getTestById(id)

  if (!test) {
    notFound()
  }

  // Convert string decimals to numbers and handle null values
  const convertedTest = {
    ...test,
    type: test.category,
    asr: test.asr ? parseFloat(test.asr) : null,
    accuracy: test.accuracy ? parseFloat(test.accuracy) : null,
    recall: test.recall ? parseFloat(test.recall) : null,
    precision: test.precision ? parseFloat(test.precision) : null,
    f1: test.f1 ? parseFloat(test.f1) : null,
    latency: test.latency ? parseFloat(test.latency) : null,
    tokenUsage: test.tokenUsage,
    categoryWiseASR: test.categoryWiseASR as Record<string, number> | null,
    defenseASR: test.defenseASR ? parseFloat(test.defenseASR) : null,
    defenseAccuracy: test.defenseAccuracy ? parseFloat(test.defenseAccuracy) : null,
    defenseRecall: test.defenseRecall ? parseFloat(test.defenseRecall) : null,
    defensePrecision: test.defensePrecision ? parseFloat(test.defensePrecision) : null,
    defenseF1: test.defenseF1 ? parseFloat(test.defenseF1) : null,
    defenseLatency: test.defenseLatency ? parseFloat(test.defenseLatency) : null,
    defenseTokenUsage: test.defenseTokenUsage,
    defenseCategoryWiseASR: test.defenseCategoryWiseASR as Record<string, number> | null,
  }

  return <TestComparisonClient testData={convertedTest} />
}
