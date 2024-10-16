
export default function TableTeam() {

    return (
        <table className="table-auto flex-grow w-full">
          <thead className="flex-grow">
            <tr>
              <th className="text-left">Ruolo</th>
              <th className="text-left">Nome</th>
              <th className="text-left">Prezzo</th>
              <th className="text-left">PDK</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td>Malcolm Lockyer</td>
              <td>1961</td>
            </tr>
            <tr>
              <td>Witchy Woman</td>
              <td>The Eagles</td>
              <td>1972</td>
            </tr>
            <tr>
              <td>Shining Star</td>
              <td>Earth, Wind, and Fire</td>
              <td>1975</td>
            </tr>
          </tbody>
        </table>
      )
}