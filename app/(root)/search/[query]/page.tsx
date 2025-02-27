"use client";

import { useEffect, useState } from "react";
import { fakeData } from "@/constants/fakeData";
import { Users, Ruler, Star, Briefcase } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPage = ({ params }: { params: { query: string } }) => {
  const [decodedQuery, setDecodedQuery] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setDecodedQuery(decodeURIComponent(unwrappedParams.query));
    };

    unwrapParams();
  }, [params]);

  const searchParams = decodedQuery ? new URLSearchParams(decodedQuery) : null;
  const location = searchParams?.get("location");
  const time = searchParams?.get("time");
  const space = searchParams?.get("space");
  const people = searchParams?.get("people");

  interface SearchResult {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    address: string;
    roomCapacity: string;
    roomType: string;
    roomSize: string;
    rating: number;
    time: string;
    latitude: number;
    longitude: number;
    mapUrl: string;
  }

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (decodedQuery) {
      const filteredResults = fakeData.filter((item) => {
        return (
          (!location || item.address.includes(location)) &&
          (!time || item.time.includes(time)) &&
          (!space || item.roomType.includes(space)) &&
          (!people || item.roomCapacity.includes(people))
        );
      });
      setResults(filteredResults as SearchResult[]);
      setLoading(false);
      if (filteredResults.length > 0 && !selectedResult) {
        setSelectedResult(filteredResults[0]);
      }
    }
  }, [decodedQuery, location, time, space, people, selectedResult]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Button className="ml-2  text-white px-4 py-2 rounded-md  transition">
            Lọc
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h1>
        <p className="text-gray-500 mb-4">
          {results.length} kết quả được tìm thấy
        </p>

        <div className="grid grid-cols-1 gap-6">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-4 rounded-lg shadow-md flex gap-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedResult(result)}
              >
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-1/3 h-40 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between w-2/3">
                  <h2 className="text-xl font-bold">{result.title}</h2>
                  <p className="text-gray-600 text-sm">{result.address}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" /> {result.roomType}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" /> {result.roomCapacity}
                    </div>
                    <div className="flex items-center">
                      <Ruler size={16} className="mr-1" /> {result.roomSize}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-yellow-500 font-semibold">
                      <Star size={16} className="mr-1" /> {result.rating}
                    </div>
                    <p className="text-lg font-bold">${result.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy kết quả nào</p>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-md h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4">Bản đồ</h2>
        <div className="h-96">
          {selectedResult ? (
            <iframe
              src={selectedResult.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <img
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg?t=st=1740509479~exp=1740513079~hmac=fb9232accc15d60c89c3ff49d0501d052507d8d41e7f29e996ddb4a42ad3fabf&w=1380"
              alt="No Results Found"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
