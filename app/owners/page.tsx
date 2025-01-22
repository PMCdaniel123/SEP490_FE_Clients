"use client";

import Link from "next/link";

function OwnerHomePage() {
  return (
    <div>
      <h1>Welcome to the Owner Home Page!</h1>
      <button>
        <Link href="/">Back to Home Page</Link>
      </button>
    </div>
  );
}

export default OwnerHomePage;
