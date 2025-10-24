export class LengthUtil {
  static calculateLengthScore(content: string, prompt: string): number {
    if (!content.trim()) return 0;

    const wordCount = content.split(/\s+/).length;
    const promptWordCount = prompt.split(/\s+/).length;

    // Optimal length is 2-5x the prompt length
    const optimalMin = promptWordCount * 2;
    const optimalMax = promptWordCount * 5;

    if (wordCount < optimalMin) {
      return Math.max(wordCount / optimalMin, 0.2);
    } else if (wordCount > optimalMax) {
      return Math.max(optimalMax / wordCount, 0.2);
    } else {
      return 1;
    }
  }
}
