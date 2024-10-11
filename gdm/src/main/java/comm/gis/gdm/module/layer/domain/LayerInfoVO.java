package comm.gis.gdm.module.layer.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LayerInfoVO {

    @ApiModelProperty("图层名")
    private String layersName;

    @ApiModelProperty("单位数组")
    private List<String> orgCodes;

    @ApiModelProperty("关键字")
    private String keyWord;

    @ApiModelProperty("查询方式")
    private String gisQueryType;

    @ApiModelProperty("查询值")
    private String gisQueryValue;

}
