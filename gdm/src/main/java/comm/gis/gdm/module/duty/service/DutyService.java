package comm.gis.gdm.module.duty.service;

import java.util.List;

import comm.gis.gdm.module.duty.domain.*;

public interface DutyService {

        /**
         * 获取勤务网格列表
         */
        List<DutyRegionEntity> getDutyRegionList(List<String> orgCodes, List<Integer> typeIds);

        /*
         * 保存图形修改
         */
        Boolean saveRegionInfo(DutyRegionEntity param);

        /*
         * 保存图形修改
         */
        Boolean saveRegionEdit(Long regionId, String content);

        /*
         * 删除图形
         */
        Boolean deleteRegion(Long id);
}
