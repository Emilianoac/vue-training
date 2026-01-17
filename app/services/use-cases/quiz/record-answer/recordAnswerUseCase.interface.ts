
import type { Quiz, AnswerRecord, Question} from "@/types/quiz";


export type RecordAnswerUseCase = (question: Question, selectedOptionId: string | null) => AnswerRecord;