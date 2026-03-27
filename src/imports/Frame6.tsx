import svgPaths from "./svg-r9x1qv69mw.ts";
// import imgRectangle59 from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
const imgRectangle59 = "https://via.placeholder.com/150";
import { useNavigate } from "react-router";

function ProductCard() {
  return (
    <div className="flex flex-col gap-[5px] items-start justify-center p-[10px] min-w-[287px] shrink-0">
      <div className="content-stretch flex flex-col isolate items-end pb-[64px] relative shrink-0">
        <div className="h-[64px] mb-[-64px] relative shrink-0 w-[68px] z-[2]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 64">
            <g id="Frame 427318205">
              <path d={svgPaths.p1259f9f0} fill="var(--fill-0, #9A9A9A)" id="Vector" />
            </g>
          </svg>
        </div>
        <div className="mb-[-64px] pointer-events-none relative shrink-0 size-[287.461px] z-[1]">
          <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgRectangle59} />
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0" />
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[20px] text-black w-[287.461px]">
        Gildan® 5000 | Heavyweight Unisex Crewneck T-shirt
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.2] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        Gildan 5000
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[0px] text-black w-[209.006px]">
        <span className="font-['Inter:Bold',sans-serif] font-bold leading-[1.2] text-[20px]">₹ 1,320.23</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold leading-[1.2] text-[16px]">{` `}</span>
        <span className="leading-[1.2] text-[16px]">excl. VAT</span>
      </p>
    </div>
  );
}

export default function Frame() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f1f3f6] min-h-screen w-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black h-[70px] w-full flex items-center justify-between px-4 md:px-8 lg:px-[360px]">
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-solid border-white h-[40px] w-[40px] md:w-[350px] rounded-[7px]" />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:block bg-[#d9d9d9] border-2 border-solid border-white h-[40px] w-[40px] rounded-[7px]" />
          <p className="hidden md:block font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white whitespace-nowrap">Cart</p>
          <div className="hidden md:block bg-[#d9d9d9] h-[24px] w-[1px]" />
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] md:text-[16px] text-white whitespace-nowrap">Order</p>
          <div className="hidden md:block bg-[#d9d9d9] rounded-[39px] h-[24px] w-[24px]" />
          <p className="hidden lg:block font-['Inter:Medium',sans-serif] font-medium text-[16px] text-white whitespace-nowrap">
            Hello, siranjeevi
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] w-full">
        <div className="px-4 md:px-8 lg:px-[120px] py-4 flex flex-wrap gap-2 md:gap-[30px] items-center overflow-x-auto">
          <div className="flex gap-[5px] items-center shrink-0">
            <div className="bg-[#ffab03] px-[10px] py-[13px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[14px] md:text-[16px] text-black whitespace-nowrap">
                Product catalog
              </p>
            </div>
            <div className="bg-white px-[10px] py-[13px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[14px] md:text-[16px] text-black whitespace-nowrap">
                Gallery
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-[10px] items-center flex-wrap shrink-0">
            <div className="bg-white px-[10px] py-[13px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[14px] md:text-[16px] text-black whitespace-nowrap">
                Your creation
              </p>
            </div>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#eee] flex gap-[5px] items-center justify-center px-[10px] py-[7px] shrink-0">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[14px] md:text-[16px] text-black whitespace-nowrap">
                  Design {i}
                </p>
                <div className="relative shrink-0 size-[11.689px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6892 11.6892">
                    <path d={svgPaths.p3c38b800} fill="var(--fill-0, #A1A1A1)" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-[210px] py-4">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[3] text-[#666] text-[12px] md:text-[14px] whitespace-pre">
          {`Product catalog   >  Bestsellers`}
        </p>
      </div>

      {/* Main Title */}
      <div className="px-4 md:px-8 lg:px-[210px] pb-4">
        <h1 className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[24px] md:text-[36px] text-black">
          Product catalog
        </h1>
      </div>

      {/* Divider */}
      <div className="px-4 md:px-8 lg:px-[216px] mb-6">
        <div className="h-[1px] bg-[#DEDEDE]" />
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-[210px] pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#d9d9d9] h-[100px] lg:h-[129.927px] w-[80px] lg:w-[103px] shrink-0" />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 max-w-full lg:max-w-[704px]">
            <div className="bg-[#d9d9d9] w-full aspect-[704/767] max-h-[500px] lg:max-h-[767.829px]" />
          </div>

          {/* Right Panel - Product Details */}
          <div className="flex-1 lg:max-w-[650px]">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[20px] md:text-[24px] text-black mb-6">
              Heavyweight Unisex Crewneck T-shirt | Gildan® 5000
            </h2>

            {/* Technology */}
            <div className="mb-6">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[16px] text-black mb-3">
                Technology
              </p>
              <div className="bg-[#ffab03] px-[10px] py-[13px] w-full md:w-[319px]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[16px] text-black whitespace-nowrap">
                  Product catalog
                </p>
              </div>
            </div>

            {/* Print Technique */}
            <div className="mb-6">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[16px] text-black mb-3">
                Print technique
              </p>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-[#ffab03] px-[10px] py-[13px] flex-1 min-w-[150px] md:min-w-0 md:w-[319px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[16px] text-black whitespace-nowrap">
                    Product catalog
                  </p>
                </div>
                <div className="bg-[#ffab03] px-[10px] py-[13px] flex-1 min-w-[150px] md:min-w-0 md:w-[319px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[16px] text-black whitespace-nowrap">
                    Product catalog
                  </p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[16px] text-black mb-3">
                Color: White
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-8 xl:grid-cols-14 gap-2 md:gap-[10.55px]">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="bg-[#d9d9d9] aspect-square w-full max-w-[33.546px]" />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[16px] text-black mb-3">
                Size: S
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-[10.55px] max-w-[400px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-[#d9d9d9] aspect-square w-full max-w-[33.546px]" />
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="mb-2">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[#696969] mb-1">
                  Product price
                </p>
                <p className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-[#696969]">₹1,320.23</p>
              </div>
              
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[28px] md:text-[36px] text-black inline">
                ₹660.11
              </p>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black ml-2">
                excl. VAT
              </span>
              
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black mt-2">
                if placed in the next 44h 26m 12s
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/designing-area')}
                className="bg-[#ffab03] w-full px-[10px] py-[13px] hover:bg-[#ff9900] transition-colors"
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-[rgba(0,0,0,0.8)] tracking-[-0.176px]">
                  Printed product
                </p>
              </button>
              <button className="bg-[#ffab03] w-full px-[10px] py-[13px] hover:bg-[#ff9900] transition-colors">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black">
                  Add to store
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 bg-white p-6 md:p-8 lg:p-10 lg:ml-[118px] lg:max-w-[642px]">
          <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-black mb-4">Description</h3>
          
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black leading-[2] mb-4">
            This heavyweight cotton t-shirt is a durable staple product with a classic fit. One of the most popular items, it has a relaxed style made for casual wear.
          </p>
          
          <ul className="list-disc ml-6 mb-4">
            <li className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black leading-[1.19]">
              Seamless double-needle collar
            </li>
            <li className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black leading-[1.19]">
              Double-needle sleeve and bottom hems
            </li>
            <li className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black leading-[1.19]">
              Taped neck and shoulders for durability
            </li>
          </ul>
          
          <h4 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-black mb-2">Fabrication:</h4>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black mb-4">
            <span className="leading-[2]">Solid Colors are made from 100% cotton (preshrunk jersey knit); Ash Grey is </span>
            <span className="leading-[1.5]">99% Airlume combed and ring-spun cotton, 1% polyester; Sport Grey is 90% cotton, 10% polyester; Heather Colors are 50% cotton, 50% polyester.</span>
          </p>
          
          <h4 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-black mb-2">Product UID</h4>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black">
            <span className="leading-[2]">apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-</span>
            <span className="leading-[1.5]">weight_gsi_s_gco_white_gpr_4-0_gildan_5000</span>
          </p>
        </div>
      </div>

      {/* Goes Well Together Section */}
      <div className="px-4 md:px-8 lg:px-[210px] pb-12">
        <h2 className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[20px] md:text-[24px] text-black mb-6">
          Goes Well Together
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}