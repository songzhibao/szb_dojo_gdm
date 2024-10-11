package comm.gis.gdm.module.deduce.service;

import java.util.List;

import com.alibaba.fastjson.*;

import comm.gis.gdm.module.deduce.domain.*;

public interface DeduceService {

        /*
         * 获取播放元素
         */
        DeduceTaskEntity getDeducePlayInfo(String taskId, String stageList);

        /*
         * 获取推演点树
         */
        JSONArray getDeducePointTree(String taskId, Boolean isCheck);

        /*
         * 获取推演线路图形
         */
        List<DeduceRegionEntity> getDeduceRegoions(String taskId);

        /*
         * 获取保障点
         */
        List<DeducePointEntity> getDeducePoints(String taskId);

        /*
         * 获取任务列表
         */
        List<DeduceTaskEntity> getDeduceTasks();

        /*
         * 保存图形修改
         */
        Boolean saveRegionInfo(DeduceRegionEntity param);

        /*
         * 保存图形修改
         */
        Boolean saveRegionEdit(Long regionId, String taskId, String content);

        /*
         * 保存保障点信息
         */
        Boolean savePointInfo(DeducePointEntity param);

        /*
         * 保存推演任务
         */
        Boolean saveTaskInfo(DeduceTaskEntity param);

        /*
         * 删除推演任务
         */
        Boolean deleteDeduceTask(String taskId);

        /*
         * 删除保障点
         */
        Boolean deleteDeducePoint(String id);

        /*
         * 删除图形
         */
        Boolean deleteDeduceRegion(String id);
}
