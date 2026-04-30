export function exportAsMarkdown(
  result: string,
  language: string,
  mode: string,
): string {
  let header = `# AI Code Review\n\n**Language:** ${language} | **Mode:** ${mode} | **Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`;
  return (header += result);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadMarkdown(content: string, filename: string): void {
  const bolb = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(bolb);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
