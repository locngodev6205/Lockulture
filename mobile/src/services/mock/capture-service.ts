import type { CaptureAssessment, CaptureDraft } from '@/domain/models';
import type { CaptureService } from '@/services/contracts';
const failed = new Set<string>();
export const mockCaptureService: CaptureService = {
  async evaluate(draft: CaptureDraft, signal: AbortSignal): Promise<CaptureAssessment> {
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(new Error('Đã dừng đánh giá'));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new Error('Đã dừng đánh giá'));
      };
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', abort);
        resolve();
      }, 900);
      signal.addEventListener('abort', abort, { once: true });
    });
    if (draft.scenario === 'service_error' && !failed.has(draft.id)) {
      failed.add(draft.id);
      throw new Error('Chưa thể đánh giá ảnh. Ảnh vẫn được giữ để bạn thử lại.');
    }
    const base = {
      name: 'Chưa xác định',
      knowledge: '',
      subjectKey: '',
      eraId: null,
      instruction: '',
    };
    if (draft.scenario === 'retake_required')
      return {
        ...base,
        verdict: 'retake_required',
        instruction:
          'Ảnh mẫu chưa đủ rõ. Hãy giữ máy ổn định và chụp gần hơn để thấy chữ hoặc đặc điểm chính.',
      };
    if (draft.scenario === 'unidentified')
      return {
        ...base,
        verdict: 'unidentified',
        instruction:
          'Cần thêm chi tiết để nhận diện. Hãy chụp biển tên, nhãn hoặc bảng giới thiệu của cùng đối tượng.',
      };
    if (draft.scenario === 'out_of_scope' && draft.mode === 'free')
      return {
        ...base,
        verdict: 'out_of_scope',
        instruction: 'Hãy thử một biển tên đường, món ăn hoặc đồ vật có nội dung văn hóa.',
      };
    if (draft.scenario === 'not_matched' && draft.mode === 'mission')
      return {
        ...base,
        verdict: 'not_matched',
        instruction:
          'Trong tình huống mẫu này, đối tượng chưa khớp nhiệm vụ. Hãy xem lại yêu cầu và chụp đúng mục tiêu.',
      };
    return {
      verdict: draft.mode === 'mission' ? 'completed' : 'accepted',
      name: draft.mission?.placeName ?? 'Biển tên đường Trần Hưng Đạo',
      subjectKey: draft.mission?.placeId ?? 'demo-street-tran-hung-dao',
      eraId: draft.mission?.eraId ?? 'ERA_LY_TRAN',
      instruction: '',
      knowledge: draft.mission
        ? 'Mỗi địa điểm là một cách kết nối không gian hôm nay với câu chuyện của một thời kỳ. Hãy quan sát biển tên và các chi tiết kiến trúc để tìm hiểu thêm.'
        : 'Tên đường có thể gợi nhắc một nhân vật lịch sử. Tên Trần Hưng Đạo kết nối khám phá này với thời Trần; điều đó không có nghĩa con đường được xây vào thời Trần.',
    };
  },
};
