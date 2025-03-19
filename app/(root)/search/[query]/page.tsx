"use client";

import { useEffect, useState } from "react";
import { Users, Ruler, Briefcase } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPage = ({ params }: { params: Promise<{ query?: string }> }) => {
  const [decodedQuery, setDecodedQuery] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  interface SearchResult {
    id: number;
    name: string;
    address: string;
    googleMapUrl: string;
    description: string;
    capacity: number;
    category: string;
    area: number;
    is24h: number;
    shortTermPrice: number | null;
    longTermPrice: number | null;
    images: string[];
    facilities: string[];
    policies: string[];
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const resolvedParams = await params;
        const unwrappedQuery = resolvedParams.query
          ? decodeURIComponent(resolvedParams.query)
          : "";

        setDecodedQuery(unwrappedQuery);

        const endpoint = unwrappedQuery
          ? `https://localhost:5050/users/searchbyfourcriteria?${unwrappedQuery}`
          : `https://localhost:5050/users/searchbyfourcriteria`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch search results.");
        }
        const data = await response.json();

        const mappedResults = data.workspaces.map((workspace: any) => ({
          id: workspace.id,
          name: workspace.name,
          address: workspace.address,
          googleMapUrl: workspace.googleMapUrl,
          description: workspace.description,
          capacity: workspace.capacity,
          category: workspace.category,
          area: workspace.area,
          is24h: workspace.is24h,
          shortTermPrice:
            workspace.prices.find((price: any) => price.category === "Giờ")
              ?.price || null,
          longTermPrice:
            workspace.prices.find((price: any) => price.category === "Ngày")
              ?.price || null,
          images: workspace.images.map((image: any) => image.imgUrl),
          facilities: workspace.facilities.map((facility: any) => facility.facilityName),
          policies: workspace.policies.map((policy: any) => policy.policyName),
        }));

        setResults(mappedResults);
        if (mappedResults.length > 0) {
          setSelectedResult(mappedResults[0]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [params]);

  const formatPrice = (price: number | null) => {
    if (price === null) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const extractIframeDimensions = (iframeHtml: string) => {
    const widthMatch = iframeHtml.match(/width="(\d+)"/);
    const heightMatch = iframeHtml.match(/height="(\d+)"/);
    return {
      width: widthMatch ? parseInt(widthMatch[1], 10) : 600,
      height: heightMatch ? parseInt(heightMatch[1], 10) : 450,
    };
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const mapDimensions = selectedResult
    ? extractIframeDimensions(selectedResult.googleMapUrl)
    : { width: 600, height: 450 };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Button className="ml-2 text-white px-4 py-2 rounded-md transition">
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
                  src={result.images[0] || "no-image"}
                  alt={result.name}
                  className="w-1/3 h-40 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between w-2/3">
                  <h2 className="text-xl font-bold">{result.name}</h2>
                  <p className="text-gray-600 text-sm">{result.address}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" /> {result.category}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" /> {result.capacity} người
                    </div>
                    <div className="flex items-center">
                      <Ruler size={16} className="mr-1" /> {result.area} m²
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-4">
                    <p className="text-lg font-bold">
                      {formatPrice(result.shortTermPrice)} -{" "}
                      {formatPrice(result.longTermPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy kết quả nào</p>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-md sticky top-6">
        <h2 className="text-xl font-bold mb-4">Bản đồ</h2>
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            width: "100%",
            paddingTop: `${(mapDimensions.height / mapDimensions.width) * 100}%`,
          }}
        >
          {selectedResult ? (
            <iframe
              src={selectedResult.googleMapUrl.match(/src="([^"]+)"/)?.[1] || ""}
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                border: 0,
              }}
              allowFullScreen
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