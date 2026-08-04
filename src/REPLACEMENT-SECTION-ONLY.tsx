// ============================================================
// COPY THIS ENTIRE SECTION
// Replace lines 1999-4889 in ItemMaster.tsx with this code
// ============================================================

      ) : currentView === 'add-item' ? (
        /* Add Item View - NEW STEPPER IMPLEMENTATION */
        <div className="h-full flex flex-col">
          <AddItemStepper
            sidebarExpanded={sidebarExpanded}
            onCancel={() => {
              setCurrentView('list');
              setCurrentStep(1);
              setCompletedSteps([]);
            }}
            onSubmit={() => {
              alert('Item submitted successfully!');
              setCurrentView('list');
              setCurrentStep(1);
              setCompletedSteps([]);
            }}
            addItemType={addItemType}
            setAddItemType={setAddItemType}
            gstApplicable={gstApplicable}
            setGstApplicable={setGstApplicable}
            hsnSacCode={hsnSacCode}
            setHsnSacCode={setHsnSacCode}
            gstRate={gstRate}
            setGstRate={setGstRate}
            sacSearchTerm={sacSearchTerm}
            setSacSearchTerm={setSacSearchTerm}
            showSacDropdown={showSacDropdown}
            setShowSacDropdown={setShowSacDropdown}
            sacCodeError={sacCodeError}
            setSacCodeError={setSacCodeError}
            allHsnSacCodes={sacCodesDatabase.map(sac => ({
              code: sac.code,
              description: sac.description,
              gstRate: parseInt(sac.gstRate)
            }))}
            addOpeningStock={addOpeningStock}
            setAddOpeningStock={setAddOpeningStock}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            defaultBinLocation={defaultBinLocation}
            setDefaultBinLocation={setDefaultBinLocation}
            binLocationWarehouseSearch={binLocationWarehouseSearch}
            setBinLocationWarehouseSearch={setBinLocationWarehouseSearch}
            showBinLocationWarehouseDropdown={showBinLocationWarehouseDropdown}
            setShowBinLocationWarehouseDropdown={setShowBinLocationWarehouseDropdown}
            attachedVendors={attachedVendors}
            setAttachedVendors={setAttachedVendors}
            selectedVendorRows={selectedVendorRows}
            setSelectedVendorRows={setSelectedVendorRows}
          />
        </div>
      ) : (
