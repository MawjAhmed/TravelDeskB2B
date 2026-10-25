
import Image from "next/image";

export default function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/Brand.jpeg"
        alt="DUBAILAND Travel & Tourism"
        width={60}
        height={60}
        className="h-11 w-11 object-contain"
        priority
      />
      <div>
        <div className="text-[17px] font-semibold tracking-[0.19em] text-white">
          DUBAILAND
        </div>
        <div className="mt-1 text-[8px] tracking-[0.31em] text-[#c9ad75]">
          TRAVEL & TOURISM
        </div>
      </div>
    </div>
  );
}
