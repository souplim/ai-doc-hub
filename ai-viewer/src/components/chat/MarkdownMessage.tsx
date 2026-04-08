import "./MarkdownMessage.css";

type MarkdownMessageProps = {
  text: string;
};

const isTableSeparatorRow = (line: string) => {
  const cells = line
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);

  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell))
  );
};

const isMarkdownTableBlock = (block: string) => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.length >= 2 &&
    lines[0].includes("|") &&
    isTableSeparatorRow(lines[1])
  );
};

const parseTableRow = (line: string) =>
  line
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell, index, cells) => {
      if (cells.length === 1) {
        return true;
      }

      return cell !== "" || (index !== 0 && index !== cells.length - 1);
    });

function MarkdownMessage({ text }: MarkdownMessageProps) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="markdown-message">
      {blocks.map((block, index) => {
        if (isMarkdownTableBlock(block)) {
          const lines = block
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          const headers = parseTableRow(lines[0]);
          const rows = lines.slice(2).map(parseTableRow);

          return (
            <div className="markdown-table-wrap" key={`table-${index}`}>
              <table className="markdown-table">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p className="markdown-paragraph" key={`paragraph-${index}`}>
            {block.split("\n").map((line, lineIndex) => (
              <span key={`line-${lineIndex}`}>
                {line}
                {lineIndex < block.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownMessage;
