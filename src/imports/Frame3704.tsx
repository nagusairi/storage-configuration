import svgPaths from "./svg-3sxu2fwong";

function BasilCurrentLocationOutline() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="basil:current-location-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2198_4998)" id="basil:current-location-outline">
          <path d={svgPaths.p2af3fc80} fill="var(--fill-0, black)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p2b64ea70} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_2198_4998">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FoCell() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative rounded-tl-[4px] shrink-0 w-[170px]" data-name="--FO-Cell">
      <BasilCurrentLocationOutline />
      <p className="[white-space-collapse:collapse] font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap w-[83px]">Total Spend (YTD)</p>
    </div>
  );
}

function FoCell1() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-tr-[4px] shrink-0" data-name="--FO-Cell">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center pl-[12px] pr-[8px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] w-[66px]">₹1.28 Cr</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="box-border content-stretch flex items-center px-0 py-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none" />
      <FoCell />
      <FoCell1 />
    </div>
  );
}

function TablerReservedLine() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="tabler:reserved-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="tabler:reserved-line">
          <path d={svgPaths.p3b08800} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function FoCell2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative rounded-tl-[4px] shrink-0 w-[170px]" data-name="--FO-Cell">
      <TablerReservedLine />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Open Purchase Orders</p>
    </div>
  );
}

function FoCell3() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-tr-[4px] shrink-0" data-name="--FO-Cell">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-0 h-[32px] items-start justify-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#c9372c] text-[12px]">3 Orders</p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[#626f86] text-[10px]">(12 Units)</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="box-border content-stretch flex items-center px-0 py-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none" />
      <FoCell2 />
      <FoCell3 />
    </div>
  );
}

function MaterialSymbolsLightEventAvailableOutline() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="material-symbols-light:event-available-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="material-symbols-light:event-available-outline">
          <path d={svgPaths.p81a9980} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FoCell4() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[170px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <MaterialSymbolsLightEventAvailableOutline />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Avg Lead Time</p>
    </div>
  );
}

function FoCell5() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">14 days</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell4 />
      <FoCell5 />
    </div>
  );
}

// New components for Open Sales Orders
function ShoppingCartIcon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="shopping-cart-icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="shopping-cart">
          <path d="M1 1h2l.4 2m0 0l1.6 8h8l2-6H3.4z" stroke="#44546F" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="12.5" r="0.5" fill="#44546F" />
          <circle cx="11" cy="12.5" r="0.5" fill="#44546F" />
        </g>
      </svg>
    </div>
  );
}

function FoCellSalesOrdersLabel() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[170px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <ShoppingCartIcon />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Open Sales Orders</p>
    </div>
  );
}

function FoCellSalesOrdersValue() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-0 h-[32px] items-start justify-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#172b4d] text-[12px]">8 Orders</p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[12px] not-italic relative shrink-0 text-[#626f86] text-[10px]">(24 Units)</p>
        </div>
      </div>
    </div>
  );
}

function FrameSalesOrders() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCellSalesOrdersLabel />
      <FoCellSalesOrdersValue />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[18.75%_8.33%_14.58%_8.33%]" data-name="Group">
      <div className="absolute inset-[-6.25%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 11">
          <g id="Group">
            <path d={svgPaths.p7fd7d00} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.p7a96d80} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="1.16667" />
            <path d={svgPaths.p1b523300} id="Vector_3" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconParkOutlineIncoming() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="icon-park-outline:incoming">
      <Group />
    </div>
  );
}

function FoCell6() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[170px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconParkOutlineIncoming />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Quality Score</p>
    </div>
  );
}

function FoCell7() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">89/100</p>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell6 />
      <FoCell7 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[18.75%_8.33%_14.58%_8.33%]" data-name="Group">
      <div className="absolute inset-[-6.25%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 11">
          <g id="Group">
            <path d={svgPaths.p7fd7d00} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.p7a96d80} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="1.16667" />
            <path d={svgPaths.p1b523300} id="Vector_3" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconParkOutlineIncoming1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="icon-park-outline:incoming">
      <Group1 />
    </div>
  );
}

function FoCell8() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[170px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconParkOutlineIncoming1 />
      <p className="[white-space-collapse:collapse] font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap w-[93px]">On-Time Delivery:</p>
    </div>
  );
}

function FoCell9() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#22a06b] text-[12px] text-nowrap whitespace-pre">93%</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell8 />
      <FoCell9 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="w-full">
        <div className="box-border content-stretch flex flex-col gap-px items-start p-px relative w-full">
          <Frame3 />
          {/* <Frame1 /> - Avg Lead Time row hidden */}
          <FrameSalesOrders />
        </div>
      </div>
    </div>
  );
}

function AppSummary() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[7px] items-start overflow-clip w-full" data-name="App Summary">
      <Frame2 />
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="relative w-full">
      <AppSummary />
    </div>
  );
}