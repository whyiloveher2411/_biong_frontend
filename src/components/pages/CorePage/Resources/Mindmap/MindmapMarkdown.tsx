import React from "react";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";
import { Box } from "@mui/material";
const { Markmap, loadCSS, loadJS } = markmap;


const MindmapMarkdown = ({ md, option, height }: { md: string, option?: ANY, height?: string }) => {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const transformer = new Transformer();
      ref.current.innerHTML = "";
      const { root, features } = transformer.transform(md);
      const { styles, scripts } = transformer.getUsedAssets(features);
      if (styles) loadCSS(styles);
      if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
      Markmap.create(ref.current, option, root);
    }
  }, [md, option]);
  return <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      'svg div, svg foreignObject': {
        pointerEvents: 'none',
        marginRight: '-100px',
      }
    }}
  >
    <svg ref={ref} style={{ width: '100%', minHeight: height ?? '800px', height: 'auto', color: 'inherit' }}></svg>
  </Box>
};

export default MindmapMarkdown;