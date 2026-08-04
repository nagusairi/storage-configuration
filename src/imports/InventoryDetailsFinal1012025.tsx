import svgPaths from "./svg-7v1n1uk97";

function FoBreadcrumbItemUnderscore() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[4px] py-[8px] relative shrink-0" data-name="-fo-breadcrumb-item-underscore">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[15.2px] relative shrink-0 text-[#6b778c] text-[13px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        /
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#758195] text-[12px] text-nowrap whitespace-pre">Home</p>
      <FoBreadcrumbItemUnderscore />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame1 />
    </div>
  );
}

function FoBreadcrumbItemUnderscore1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[4px] py-[8px] relative shrink-0" data-name="-fo-breadcrumb-item-underscore">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[15.2px] relative shrink-0 text-[#6b778c] text-[13px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        /
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#758195] text-[12px] text-nowrap tracking-[0.48px] whitespace-pre">Legal Enity</p>
      <FoBreadcrumbItemUnderscore1 />
    </div>
  );
}

function FoBreadcrumbItemUnderscore2() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[4px] py-[8px] relative shrink-0" data-name="-fo-breadcrumb-item-underscore">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[15.2px] relative shrink-0 text-[#6b778c] text-[13px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        /
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#758195] text-[12px] text-nowrap tracking-[0.48px] whitespace-pre">Inventory List</p>
      <FoBreadcrumbItemUnderscore2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame3 />
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap tracking-[0.48px] whitespace-pre">Laptop Dell XPS 15-(SKU-LPT-001)</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame5 />
      <Frame6 />
      <Frame7 />
    </div>
  );
}

function FoCompBadges() {
  return (
    <div className="bg-[#fff3eb] box-border content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[2px] relative rounded-[5px] shrink-0" data-name="--fo-comp-badges">
      <div aria-hidden="true" className="absolute border border-[#fedec8] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <p className="font-['Poppins:Bold',sans-serif] leading-[14.1px] not-italic relative shrink-0 text-[#c25100] text-[10px] text-nowrap tracking-[0.1px] uppercase whitespace-pre">low stock</p>
    </div>
  );
}

function ArrowLeft() {
  return (
    <div className="relative size-[24px]" data-name="Arrow-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Arrow-left">
          <path clipRule="evenodd" d={svgPaths.p2e22d300} fill="var(--fill-0, #B3B9C4)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ArrowLeft1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Arrow-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Arrow-left">
          <path clipRule="evenodd" d={svgPaths.p2e22d300} fill="var(--fill-0, #44546F)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <ArrowLeft />
        </div>
      </div>
      <ArrowLeft1 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="box-border content-stretch flex gap-[11px] items-center px-[5px] py-0 relative shrink-0">
      <FoCompBadges />
      <Frame71 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame8 />
      <Frame72 />
    </div>
  );
}

function MdiLink() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="mdi:link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2198_5194)" id="mdi:link">
          <path d={svgPaths.p3e8a1e80} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2198_5194">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NbIconTextButton() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center p-[8px] relative rounded-[3px]" data-name="--nb-icon-text-button">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <MdiLink />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">AI Insights</p>
    </div>
  );
}

function MdiLink1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="mdi:link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2198_5194)" id="mdi:link">
          <path d={svgPaths.p3e8a1e80} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2198_5194">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NbIconTextButton1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center p-[8px] relative rounded-[3px]" data-name="--nb-icon-text-button">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <MdiLink1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Edit</p>
    </div>
  );
}

function NbIconTextButton2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[3px] size-[32px]" data-name="--nb-icon-text-button">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="h-[3px] relative shrink-0 w-[12px]" data-name="Dots">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(68, 84, 111, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 3">
            <path d={svgPaths.p20bf5ef0} fill="var(--fill-0, #44546F)" id="Dots" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative">
      <div className="flex h-[32.102px] items-center justify-center min-w-[32px] relative shrink-0 w-[99.033px]" style={{ "--transform-inner-width": "94.03125", "--transform-inner-height": "32" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.941deg]">
          <NbIconTextButton />
        </div>
      </div>
      <div className="flex h-[32.062px] items-center justify-center min-w-[32px] relative shrink-0 w-[60.033px]" style={{ "--transform-inner-width": "58.671875", "--transform-inner-height": "32" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.941deg]">
          <NbIconTextButton1 />
        </div>
      </div>
      <div className="flex items-center justify-center min-w-[32px] relative shrink-0 size-[32.033px]" style={{ "--transform-inner-width": "32", "--transform-inner-height": "32" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.941deg]">
          <NbIconTextButton2 />
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[52px] items-center justify-between left-0 px-[16px] py-[8px] top-0 w-[1303px]">
      <div aria-hidden="true" className="absolute border-[#e9edf3] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame10 />
      <div className="flex h-[32.307px] items-center justify-center relative shrink-0 w-[199.132px]" style={{ "--transform-inner-width": "199.09375", "--transform-inner-height": "32.09375" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.059deg]">
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[13px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] tracking-[0.48px] w-[246.725px]">SKU-LPT-001</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[14px] tracking-[0.42px] w-full">Laptop Dell XPS 15</p>
      <Frame19 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame18 />
    </div>
  );
}

function DotMenu() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[3px] size-[24px]" data-name="DotMenu">
      <div className="h-[3px] relative shrink-0 w-[12px]" data-name="Dots">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(23, 43, 77, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 3">
            <path d={svgPaths.p20bf5ef0} fill="var(--fill-0, #172B4D)" id="Dots" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[7px] items-center justify-end relative shrink-0 w-[87.388px]">
      <div className="flex items-center justify-center relative shrink-0 size-[24px]" style={{ "--transform-inner-width": "24", "--transform-inner-height": "24" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <DotMenu />
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[263px]">
      <Frame36 />
      <Frame37 />
    </div>
  );
}

function FoCompBadges1() {
  return (
    <div className="bg-[#fff3eb] box-border content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[2px] relative rounded-[5px] shrink-0" data-name="--fo-comp-badges">
      <div aria-hidden="true" className="absolute border border-[#fedec8] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <p className="font-['Poppins:Bold',sans-serif] leading-[14.1px] not-italic relative shrink-0 text-[#c25100] text-[10px] text-nowrap tracking-[0.1px] uppercase whitespace-pre">low stock</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
      <Frame35 />
      <FoCompBadges1 />
    </div>
  );
}

function PhUniteLight() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="ph:unite-light">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2198_5029)" id="ph:unite-light">
          <path d={svgPaths.p4408d00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2198_5029">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FoCell() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <PhUniteLight />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">UoM</p>
    </div>
  );
}

function FoCell1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0 w-[128px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] w-[124.5px]">pcs</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell />
      <FoCell1 />
    </div>
  );
}

function CircumBarcode() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="circum:barcode">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="circum:barcode">
          <path d={svgPaths.p320b7100} fill="var(--fill-0, #44546F)" id="Vector" />
          <path d={svgPaths.p297df700} fill="var(--fill-0, #44546F)" id="Vector_2" />
          <path d={svgPaths.pc197f80} fill="var(--fill-0, #44546F)" id="Vector_3" />
          <path d={svgPaths.p33f86800} fill="var(--fill-0, #44546F)" id="Vector_4" />
          <path d={svgPaths.p2ac6c600} fill="var(--fill-0, #44546F)" id="Vector_5" />
          <path d={svgPaths.pa782080} fill="var(--fill-0, #44546F)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function FoCell2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative rounded-tl-[4px] shrink-0 w-[123px]" data-name="--FO-Cell">
      <CircumBarcode />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Barcode</p>
    </div>
  );
}

function FoCell3() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center pl-[12px] pr-[8px] py-[13px] relative rounded-tr-[4px] shrink-0 w-[128px]" data-name="--FO-Cell">
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] w-[124.5px]">893456789012</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex items-center px-0 py-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none" />
      <FoCell2 />
      <FoCell3 />
    </div>
  );
}

function MaterialSymbolsLightWarehouseOutline() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="material-symbols-light:warehouse-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="material-symbols-light:warehouse-outline">
          <path d={svgPaths.pe3bdb00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FoCell4() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-full items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <MaterialSymbolsLightWarehouseOutline />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">HSN Code:</p>
    </div>
  );
}

function FoCell5() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0 w-[128px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="[white-space-collapse:collapse] font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap w-[126px]">84713010</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full">
      <FoCell4 />
      <FoCell5 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[16.67%]" data-name="Group">
      <div className="absolute inset-[-4.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <g id="Group">
            <path d={svgPaths.pad8cc80} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
            <path d={svgPaths.p37c4f980} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
            <path d={svgPaths.p3278c00} id="Vector_3" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconamoonCategoryLight() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="iconamoon:category-light">
      <Group />
    </div>
  );
}

function FoCell6() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconamoonCategoryLight />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Category</p>
    </div>
  );
}

function FoCell7() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0 w-[128px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Electronics</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell6 />
      <FoCell7 />
    </div>
  );
}

function TablerBrandAirtable() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="tabler:brand-airtable">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="tabler:brand-airtable">
          <path d={svgPaths.p33f5500} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function FoCell8() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TablerBrandAirtable />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Brand</p>
    </div>
  );
}

function FoCell9() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0 w-[128px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Dell Technologies</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell8 />
      <FoCell9 />
    </div>
  );
}

function MaterialSymbolsLightWarehouseOutline1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="material-symbols-light:warehouse-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="material-symbols-light:warehouse-outline">
          <path d={svgPaths.pe3bdb00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FoCell10() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] items-start pl-[8px] pr-[16px] py-[13px] relative self-stretch shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <MaterialSymbolsLightWarehouseOutline1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Warehouse</p>
    </div>
  );
}

function FoCell11() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] items-start px-[12px] py-[13px] relative shrink-0 w-[128px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="-webkit-box font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative self-stretch shrink-0 text-[#172b4d] text-[12px] w-[116px]">
        {`WH-01 (Bangalore), `}
        <br aria-hidden="true" />
        WH-03 (Hyderabad)
      </p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <FoCell10 />
      <FoCell11 />
    </div>
  );
}

function StashDataDateLight() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="stash:data-date-light">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="stash:data-date-light">
          <path d={svgPaths.p29eda340} fill="var(--fill-0, #44546F)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3a4b4b00} fill="var(--fill-0, #44546F)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FoCell12() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <StashDataDateLight />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Last Updated</p>
    </div>
  );
}

function FoCell13() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center pl-[12px] pr-[8px] py-[13px] relative rounded-tr-[4px] shrink-0 w-[128px]" data-name="--FO-Cell">
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] w-[124.5px]">07/12/2025</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell12 />
      <FoCell13 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="box-border content-stretch flex flex-col gap-px items-start p-px relative rounded-[4px] shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Frame14 />
      <Frame11 />
      <Frame22 />
      <Frame12 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-0 pt-[16px] px-[20px] relative w-full">
          <Frame21 />
          <Frame13 />
        </div>
      </div>
    </div>
  );
}

function TabContents() {
  return (
    <div className="basis-0 box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px overflow-clip px-0 py-[14px] relative shrink-0" data-name="Tab Contents">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap tracking-[0.12px]">
        <p className="leading-[16.4px] whitespace-pre">Pricing Snapshot</p>
      </div>
    </div>
  );
}

function TabNewmenu() {
  return (
    <button className="box-border content-stretch cursor-pointer flex flex-col h-[42px] items-start justify-between overflow-clip px-[16px] py-0 relative shrink-0" data-name="tab_newmenu">
      <TabContents />
    </button>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex h-[30px] items-center relative shrink-0 w-[290px]">
      <TabNewmenu />
    </div>
  );
}

function BxUnite() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="bx:unite">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="bx:unite">
          <path d={svgPaths.p106c9480} fill="var(--fill-0, #44546F)" id="Vector" />
          <path d={svgPaths.p18d85f80} fill="var(--fill-0, #44546F)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FoCell14() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <BxUnite />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Cost Price</p>
    </div>
  );
}

function FoCell15() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">₹1,32,000 per unit</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell14 />
      <FoCell15 />
    </div>
  );
}

function EpSell() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="ep:sell">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="ep:sell">
          <path d={svgPaths.p10056c00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FoCell16() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <EpSell />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Selling Price</p>
    </div>
  );
}

function FoCell17() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">₹1,49,999 per unit</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell16 />
      <FoCell17 />
    </div>
  );
}

function TablerBoxMargin() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="tabler:box-margin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="tabler:box-margin">
          <path d={svgPaths.p3b7d0900} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function FoCell18() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[123px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TablerBoxMargin />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Margin</p>
    </div>
  );
}

function FoCell19() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">~12–14%</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell18 />
      <FoCell19 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-px items-start p-px relative w-full">
          <Frame23 />
          <Frame24 />
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[20px] py-[5px] relative w-full">
          <Frame26 />
        </div>
      </div>
    </div>
  );
}

function TabContents1() {
  return (
    <div className="basis-0 box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px overflow-clip px-0 py-[14px] relative shrink-0" data-name="Tab Contents">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap tracking-[0.12px]">
        <p className="leading-[16.4px] whitespace-pre">Stock Intelligence</p>
      </div>
    </div>
  );
}

function TabNewmenu1() {
  return (
    <button className="box-border content-stretch cursor-pointer flex flex-col h-[42px] items-start justify-between overflow-clip px-[16px] py-0 relative shrink-0" data-name="tab_newmenu">
      <TabContents1 />
    </button>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex h-[30px] items-center relative shrink-0 w-[290px]">
      <TabNewmenu1 />
    </div>
  );
}

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

function FoCell20() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative rounded-tl-[4px] shrink-0 w-[145px]" data-name="--FO-Cell">
      <BasilCurrentLocationOutline />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Current Stock</p>
    </div>
  );
}

function FoCell21() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-tr-[4px] shrink-0" data-name="--FO-Cell">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center pl-[12px] pr-[8px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] w-[124.5px]">437 units</p>
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="box-border content-stretch flex items-center px-0 py-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none" />
      <FoCell20 />
      <FoCell21 />
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

function FoCell22() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[145px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TablerReservedLine />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Reserved Stock</p>
    </div>
  );
}

function FoCell23() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative w-full">
          <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#c9372c] text-[12px] w-[124.5px]">80 units</p>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell22 />
      <FoCell23 />
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

function FoCell24() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[145px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <MaterialSymbolsLightEventAvailableOutline />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Available Stock</p>
    </div>
  );
}

function FoCell25() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2abb7f] text-[12px] text-nowrap whitespace-pre">450 units</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell24 />
      <FoCell25 />
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

function IconParkOutlineIncoming() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="icon-park-outline:incoming">
      <Group1 />
    </div>
  );
}

function FoCell26() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[145px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconParkOutlineIncoming />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Incoming PO</p>
    </div>
  );
}

function FoCell27() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0c66e4] text-[12px] text-nowrap whitespace-pre">250 units</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell26 />
      <FoCell27 />
    </div>
  );
}

function Group2() {
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
      <Group2 />
    </div>
  );
}

function FoCell28() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0 w-[145px]" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconParkOutlineIncoming1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Reorder Level</p>
    </div>
  );
}

function FoCell29() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0" data-name="--FO-Cell">
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">300 Units</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <FoCell28 />
      <FoCell29 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-px items-start p-px relative w-full">
          <Frame27 />
          <Frame28 />
          <Frame29 />
          <Frame30 />
          <Frame31 />
        </div>
      </div>
    </div>
  );
}

function AppSummary() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7px] items-start left-0 overflow-clip top-0 w-[262px]" data-name="App Summary">
      <Frame32 />
    </div>
  );
}

function Frame45() {
  return <div className="absolute bg-[#b3b9c4] bottom-0 h-[117px] right-[2px] rounded-[4px] w-[4px]" />;
}

function SidePaneTabsContent() {
  return (
    <div className="absolute h-[135px] left-0 top-0 w-[262px]" data-name="Side_Pane_Tabs_Content">
      <AppSummary />
      <Frame45 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="h-[268px] overflow-clip relative shrink-0 w-[262px]">
      <SidePaneTabsContent />
    </div>
  );
}

function Frame50() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 top-0 w-[302px]">
      <Frame20 />
      <Frame60 />
      <Frame59 />
      <Frame44 />
      <Frame43 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-white h-[967px] mr-[-8px] relative rounded-br-[4px] shrink-0 w-[302px]">
      <div className="h-[967px] overflow-clip relative rounded-[inherit] w-[302px]">
        <Frame50 />
      </div>
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none rounded-br-[4px]" />
    </div>
  );
}

function LeftPane() {
  return (
    <div className="absolute box-border content-stretch flex h-[605px] items-start left-px pl-0 pr-[8px] py-0 top-0 w-[300px]" data-name="leftPane">
      <Frame33 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white h-[752px] mr-[-8px] relative rounded-br-[4px] shrink-0 w-[302px]">
      <div className="h-[752px] overflow-x-clip overflow-y-auto relative w-[302px]">
        <LeftPane />
      </div>
      <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none rounded-br-[4px]" />
    </div>
  );
}

function Collapse() {
  return (
    <div className="relative size-[19px]" data-name="Collapse">
      <div className="absolute inset-[-14.04%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
          <g id="Collapse">
            <g filter="url(#filter0_d_2198_5362)" id="Vector">
              <path d={svgPaths.p2c45f000} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2c45f000} stroke="var(--stroke-0, #DCDFE4)" strokeLinejoin="round" strokeWidth="1.33333" />
            </g>
            <path d={svgPaths.p2f5a9300} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="24.3333" id="filter0_d_2198_5362" width="24.3333" x="5.96046e-08" y="5.96046e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2198_5362" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2198_5362" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function ExpanCollapseCircle() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[287px] top-[12px]" data-name="Expan-Collapse_Circle">
      <div className="flex items-center justify-center relative shrink-0 size-[19px]" style={{ "--transform-inner-width": "19", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <Collapse />
        </div>
      </div>
    </div>
  );
}

function LeftPane1() {
  return (
    <div className="box-border content-stretch flex h-[622px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[300px]" data-name="leftPane">
      <Frame34 />
      <ExpanCollapseCircle />
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] h-[780px] items-start relative shrink-0">
      <LeftPane1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="Group">
      <div className="absolute inset-[-5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
          <g id="Group">
            <path d={svgPaths.p255b5a00} id="Vector" stroke="var(--stroke-0, #172B4D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.pa8262c0} id="Vector_2" stroke="var(--stroke-0, #172B4D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LucideFileText() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="lucide:file-text">
      <Group3 />
    </div>
  );
}

function NdTabnavItem() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative rounded-tl-[5px] rounded-tr-[5px] shrink-0" data-name="--nd-tabnav-item">
      <div aria-hidden="true" className="absolute border-[#d1def0] border-[1px_1px_0px] border-solid inset-0 pointer-events-none rounded-tl-[5px] rounded-tr-[5px]" />
      <LucideFileText />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Stock</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative rounded-tl-[5px] rounded-tr-[5px] shrink-0">
      <NdTabnavItem />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="Group">
      <div className="absolute inset-[-5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
          <g id="Group">
            <path d={svgPaths.p255b5a00} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.pa8262c0} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LucideFileText1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="lucide:file-text">
      <Group4 />
    </div>
  );
}

function NdTabnavItem1() {
  return (
    <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative rounded-tl-[5px] rounded-tr-[5px] shrink-0" data-name="--nd-tabnav-item">
      <LucideFileText1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Batches</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative rounded-tl-[5px] rounded-tr-[5px] shrink-0">
      <NdTabnavItem1 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[8.33%_16.67%_12.5%_8.33%]" data-name="Group">
      <div className="absolute inset-[-5.26%_-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13">
          <g id="Group">
            <path d={svgPaths.p2b88b580} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.p3bca160} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconParkOutlineReport() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="icon-park-outline:report">
      <Group5 />
    </div>
  );
}

function NdTabnavItem2() {
  return (
    <div className="relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 w-full" data-name="--nd-tabnav-item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative w-full">
          <IconParkOutlineReport />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Orders</p>
        </div>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
      <NdTabnavItem2 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <g id="Group">
            <path d={svgPaths.p5a0a300} id="Vector" stroke="var(--stroke-0, #44546F)" strokeWidth="0.875" />
            <path d={svgPaths.p1e155790} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="0.875" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SolarDocumentsMinimalisticLinear() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="solar:documents-minimalistic-linear">
      <Group6 />
    </div>
  );
}

function NdTabnavItem3() {
  return (
    <div className="relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 w-full" data-name="--nd-tabnav-item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative w-full">
          <SolarDocumentsMinimalisticLinear />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Purchases</p>
        </div>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0">
      <NdTabnavItem3 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <g id="Group">
            <path d={svgPaths.p5a0a300} id="Vector" stroke="var(--stroke-0, #44546F)" strokeWidth="0.875" />
            <path d={svgPaths.p1e155790} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="0.875" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SolarDocumentsMinimalisticLinear1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="solar:documents-minimalistic-linear">
      <Group7 />
    </div>
  );
}

function NdTabnavItem4() {
  return (
    <div className="relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 w-full" data-name="--nd-tabnav-item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative w-full">
          <SolarDocumentsMinimalisticLinear1 />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">{`Sales `}</p>
        </div>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0">
      <NdTabnavItem4 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <g id="Group">
            <path d={svgPaths.p5a0a300} id="Vector" stroke="var(--stroke-0, #44546F)" strokeWidth="0.875" />
            <path d={svgPaths.p1e155790} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="0.875" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SolarDocumentsMinimalisticLinear2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="solar:documents-minimalistic-linear">
      <Group8 />
    </div>
  );
}

function NdTabnavItem5() {
  return (
    <div className="relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 w-full" data-name="--nd-tabnav-item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative w-full">
          <SolarDocumentsMinimalisticLinear2 />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Documents</p>
        </div>
      </div>
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0">
      <NdTabnavItem5 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <g id="Group">
            <path d={svgPaths.p5a0a300} id="Vector" stroke="var(--stroke-0, #44546F)" strokeWidth="0.875" />
            <path d={svgPaths.p1e155790} id="Vector_2" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeWidth="0.875" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SolarDocumentsMinimalisticLinear3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="solar:documents-minimalistic-linear">
      <Group9 />
    </div>
  );
}

function NdTabnavItem6() {
  return (
    <div className="relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 w-full" data-name="--nd-tabnav-item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[12px] py-[8px] relative w-full">
          <SolarDocumentsMinimalisticLinear3 />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre">Activities</p>
        </div>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0">
      <NdTabnavItem6 />
    </div>
  );
}

function Frame55() {
  return <div className="h-[34px] shrink-0 w-[80px]" />;
}

function MaterialSymbolsArrowForwardRounded() {
  return (
    <div className="absolute left-[695px] size-[22px] top-[6px]" data-name="material-symbols:arrow-forward-rounded">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(220, 223, 228, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
          <g id="material-symbols:arrow-forward-rounded">
            <rect fill="var(--fill-0, white)" height="21" rx="10.5" width="21" x="0.5" y="0.5" />
            <rect height="21" rx="10.5" stroke="var(--stroke-0, #DCDFE4)" width="21" x="0.5" y="0.5" />
            <path d={svgPaths.p375e3b00} fill="var(--fill-0, #44546F)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e9edf3] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center px-[10px] py-0 relative w-full">
          <Frame51 />
          <Frame52 />
          <Frame54 />
          <Frame53 />
          <Frame57 />
          <Frame56 />
          <Frame58 />
          <Frame55 />
          <MaterialSymbolsArrowForwardRounded />
        </div>
      </div>
    </div>
  );
}

function Tabnav() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[16px] py-0 relative shrink-0" data-name="TABNAV">
      <Frame40 />
    </div>
  );
}

function FilterSmRight() {
  return (
    <div className="bg-[#cce0ff] h-[32px] relative rounded-[4px] shrink-0" data-name="Filter_SM-Right">
      <div className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center overflow-clip px-[9px] py-[8px] relative rounded-[inherit]">
        <div className="flex h-[10.792px] items-center justify-center relative shrink-0 w-[6.398px]" style={{ "--transform-inner-width": "10.78125", "--transform-inner-height": "6.390625" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[6.398px] relative w-[10.792px]" data-name="Vector">
              <div className="absolute inset-[-11.72%_-6.95%]" style={{ "--stroke-0": "rgba(68, 84, 111, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 8">
                  <path d={svgPaths.p1bc984a0} id="Vector" stroke="var(--stroke-0, #44546F)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">Filter</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f1f2f4] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function MaterialSymbolsClose() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="material-symbols:close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="material-symbols:close">
          <path d={svgPaths.p3eab8d00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NdSearchTags() {
  return (
    <div className="bg-[rgba(9,30,66,0.06)] box-border content-stretch flex gap-[5px] h-[26px] items-center justify-center p-[10px] relative rounded-[5px] shrink-0" data-name="--nd-SearchTags">
      <div aria-hidden="true" className="absolute border border-[rgba(9,30,66,0.06)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[11px] text-black text-nowrap whitespace-pre">Warehouse A</p>
      <MaterialSymbolsClose />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-[2.5%_37.5%_2.5%_47.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 14">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p1e8b9500} fill="var(--fill-0, #758195)" fillRule="evenodd" id="Vector" opacity="0.2" />
          <path clipRule="evenodd" d={svgPaths.p38d5c9c0} fill="var(--fill-0, #758195)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function PepiconsPrintLineY() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="pepicons-print:line-y">
      <Group10 />
    </div>
  );
}

function MaterialSymbolsClose1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="material-symbols:close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="material-symbols:close">
          <path d={svgPaths.p3eab8d00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NdSearchTags1() {
  return (
    <div className="bg-[rgba(9,30,66,0.06)] box-border content-stretch flex gap-[5px] h-[26px] items-center justify-center p-[10px] relative rounded-[5px] shrink-0" data-name="--nd-SearchTags">
      <div aria-hidden="true" className="absolute border border-[rgba(9,30,66,0.06)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[11px] text-black text-nowrap whitespace-pre">Open</p>
      <MaterialSymbolsClose1 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <NdSearchTags />
      <PepiconsPrintLineY />
      <NdSearchTags1 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <FilterSmRight />
      <Frame70 />
    </div>
  );
}

function MingcuteSearchLine() {
  return (
    <div className="absolute overflow-clip right-[12px] size-[16px] top-1/2 translate-y-[-50%]" data-name="mingcute:search-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <g id="Vector"></g>
          <path clipRule="evenodd" d={svgPaths.pf969200} fill="var(--fill-0, #44546F)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FoCompSearch() {
  return (
    <div className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-[269px]" data-name="FO_Comp_Search">
      <div className="h-[32px] overflow-clip relative rounded-[inherit] w-[269px]">
        <MingcuteSearchLine />
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[12px] text-[#626f86] text-[14px] text-nowrap top-[calc(50%-8px)] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Table Search
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#8590a2] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function QlementineIconsMenuDots() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="qlementine-icons:menu-dots-16">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="qlementine-icons:menu-dots-16">
          <rect fill="var(--fill-0, #F2F2F2)" height="32" rx="16" width="32" />
          <path d={svgPaths.p44fbd00} fill="var(--fill-0, #44546F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <FoCompSearch />
      <QlementineIconsMenuDots />
    </div>
  );
}

function Frame41() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col gap-[10px] grow h-[36px] items-end justify-center min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0">
      <Frame />
    </div>
  );
}

function Frame69() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[4px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[6px] relative w-full">
          <Frame68 />
          <Frame41 />
        </div>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="shrink-0 sticky top-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[16px] py-0 relative w-full">
          <Frame69 />
        </div>
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
      <div className="h-[13.336px] relative shrink-0 w-[10.667px]" data-name="Vector">
        <div className="absolute inset-[-7.5%_-9.37%]" style={{ "--stroke-0": "rgba(174, 46, 36, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 16">
            <path d={svgPaths.p37a36500} id="Vector" stroke="var(--stroke-0, #AE2E24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c9372c] text-[13px] text-nowrap whitespace-pre">Alert</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <p className="-webkit-box font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#c9372c] text-[11px] w-full">
        <span className="font-['Poppins:Bold',sans-serif]">{`Moderate Risk Identified: `}</span>Additional trade references are required to strengthen the application and improve the credit rating to ‘Good (R1).
      </p>
    </div>
  );
}

function Frame63() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f87168] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[5px] items-start p-[12px] relative w-full">
          <Frame62 />
          <Frame66 />
        </div>
      </div>
    </div>
  );
}

function Frame67() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame63 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Frame67 />
    </div>
  );
}

function ReferenceOnlineBanks() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[942px]" data-name="Reference& online Banks">
      <Frame64 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] top-[12px] w-[942px]">
      <ReferenceOnlineBanks />
    </div>
  );
}

function Frame61() {
  return (
    <div className="bg-white h-[688px] relative rounded-bl-[4px] rounded-br-[4px] shrink-0 w-full">
      <div className="h-[688px] overflow-clip relative rounded-[inherit] w-full">
        <Frame65 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e9edf3] border-[0px_1px_1px] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-br-[4px]" />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="h-[812px] relative shrink-0 w-full" data-name="mainContainer">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col h-[812px] items-start px-[16px] py-0 relative w-full">
          <Frame61 />
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col h-[644px] items-start relative shrink-0 w-full">
      <MainContainer />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Tabnav />
      <Frame47 />
      <Frame49 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="box-border content-stretch flex flex-col h-[890px] items-center pb-0 pt-[12px] px-0 relative shrink-0 w-[1004px]">
      <Frame46 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute content-stretch flex gap-[2px] h-[781px] items-start left-0 top-[52px] w-[1306px]">
      <Frame38 />
      <Frame48 />
    </div>
  );
}

export default function InventoryDetailsFinal() {
  return (
    <div className="bg-[#f3f5f7] relative size-full" data-name="Inventory Details-Final 10/1/2025">
      <Frame42 />
      <Frame39 />
    </div>
  );
}