import DropDown from "../common/dropdowns/DropDown";

const downloadOptions = [
  {label:'Pdf', value:'pdf'},
  {label:'Excel', value:'excel'}
]

function DocumentDropdown({onChange}) {
    return (
      <div className="w-[62px] h-[30px] relative mr-2 flex items-center justify-center bg-[#f2f7fe] rounded-[5px] border border-[#d3d3d3]">
        <DropDown options={downloadOptions} defaultSelectedOptionIndex={0} onChange={onChange}/>
      </div>
    );
  }
  
  export default DocumentDropdown;
  