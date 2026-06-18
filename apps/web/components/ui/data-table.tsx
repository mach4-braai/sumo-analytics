interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: {
  columns: Column<T>[];
  data: T[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-700 bg-surface-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-slate-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-300">
                  {col.render
                    ? col.render(row)
                    : (row[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
