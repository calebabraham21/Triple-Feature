import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SupabaseTest() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("test_table")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setRows(data);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <h2>Supabase Test Data</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
