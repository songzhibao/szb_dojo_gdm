package comm.gis.gdm.module.deduce.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.alibaba.fastjson.*;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.deduce.domain.*;
import comm.gis.gdm.module.deduce.service.DeduceService;
import comm.gis.gdm.util.TimeUtils;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.*;
import java.util.stream.Collectors;
import org.postgis.*;

@Service
public class DeduceServiceImpl implements DeduceService {

        @Autowired
        private DeduceTaskMapper taskDao;

        @Autowired
        private DeducePointMapper pointDao;

        @Autowired
        private DeduceRegionMapper regionDao;

        @Autowired
        private DeducePoliceMapper policeDao;

        @Override
        public DeduceTaskEntity getDeducePlayInfo(String taskId, String stageList) {

                DeduceTaskEntity task = this.taskDao.selectById(taskId);
                if (task != null) {

                        List<JSONObject> list = new ArrayList<>();
                        task.setPlanItems(list);

                        QueryWrapper<DeducePointEntity> pointWrapper = new QueryWrapper<>();
                        pointWrapper.eq("task_id", taskId);
                        List<DeducePointEntity> pointList = this.pointDao.selectList(pointWrapper);
                        if (pointList != null) {
                                for (DeducePointEntity pt : pointList) {
                                        JSONObject json = new JSONObject();
                                        json.put("id", pt.getId());
                                        json.put("Name", pt.getName());
                                        json.put("lon", pt.getLon());
                                        json.put("lat", pt.getLat());
                                        json.put("Feature", pt.getAction());
                                        json.put("Type", pt.getType());
                                        json.put("playIndex", (pt.getStage() == null ? 0 : pt.getStage()));
                                        if (stageList.indexOf("," + (pt.getStage() == null ? "0"
                                                        : pt.getStage().toString()) + ",") < 0) {
                                                continue;
                                        }
                                        list.add(json);
                                }
                        }

                        QueryWrapper<DeduceRegionEntity> regionWrapper = new QueryWrapper<>();
                        regionWrapper.eq("task_id", taskId);
                        List<DeduceRegionEntity> regionList = this.regionDao.selectList(regionWrapper);
                        if (regionList != null) {
                                for (DeduceRegionEntity rg : regionList) {
                                        JSONObject json = new JSONObject();
                                        json.put("id", rg.getId());
                                        json.put("Name", rg.getName());
                                        json.put("BorderColor", rg.getBordercolor());
                                        json.put("BorderWidth", rg.getBorderwidth());
                                        json.put("FillColor", rg.getFillcolor());
                                        json.put("Opacite", rg.getOpacite());
                                        json.put("CONTENT", rg.getContent());
                                        json.put("playIndex", (rg.getStage() == null ? 0 : rg.getStage()));
                                        if (stageList.indexOf("," + (rg.getStage() == null ? "0"
                                                        : rg.getStage().toString()) + ",") < 0) {
                                                continue;
                                        }
                                        list.add(json);
                                }
                        }
                }
                return task;
        }

        @Override
        public JSONArray getDeducePointTree(String taskId, Boolean isCheck) {
                JSONArray items = new JSONArray();
                DeduceTaskEntity task = this.taskDao.selectById(taskId);

                QueryWrapper<DeducePoliceEntity> policeWrapper = new QueryWrapper<>();
                policeWrapper.eq("task_id", taskId);
                List<DeducePoliceEntity> policeList = this.policeDao.selectList(policeWrapper);

                QueryWrapper<DeducePointEntity> pointWrapper = new QueryWrapper<>();
                pointWrapper.eq("task_id", taskId);
                List<DeducePointEntity> pointList = this.pointDao.selectList(pointWrapper);

                QueryWrapper<DeduceRegionEntity> regionWrapper = new QueryWrapper<>();
                regionWrapper.eq("task_id", taskId);
                List<DeduceRegionEntity> regionList = this.regionDao.selectList(regionWrapper);

                JSONObject root = new JSONObject();
                root.put("id", 9);
                root.put("MC", task.getName());
                root.put("checked", isCheck);
                root.put("treeId", root.get("id"));
                root.put("parent", taskId);
                root.put("NodeType", "Node_Project");
                root.put("icon", "DojoTree_Icon_Node_Project");
                items.add(root);

                JSONObject stage1 = new JSONObject();
                stage1.put("id", 10);
                stage1.put("MC", "阶段一");
                stage1.put("checked", isCheck);
                stage1.put("treeId", stage1.get("id"));
                stage1.put("parent", root.get("id"));
                stage1.put("NodeType", "Node_Stage");
                stage1.put("icon", "DojoTree_Icon_Node_Stage");
                items.add(stage1);

                JSONObject stage2 = new JSONObject();
                stage2.put("id", 20);
                stage2.put("MC", "阶段二");
                stage2.put("checked", isCheck);
                stage2.put("treeId", stage2.get("id"));
                stage2.put("parent", root.get("id"));
                stage2.put("NodeType", "Node_Stage");
                stage2.put("icon", "DojoTree_Icon_Node_Stage");
                items.add(stage2);

                JSONObject stage3 = new JSONObject();
                stage3.put("id", 30);
                stage3.put("MC", "阶段三");
                stage3.put("checked", isCheck);
                stage3.put("treeId", stage3.get("id"));
                stage3.put("parent", root.get("id"));
                stage3.put("NodeType", "Node_Stage");
                stage3.put("icon", "DojoTree_Icon_Node_Stage");
                items.add(stage3);

                JSONObject stageAll = new JSONObject();
                stageAll.put("id", 0);
                stageAll.put("MC", "全阶段");
                stageAll.put("checked", isCheck);
                stageAll.put("treeId", stageAll.get("id"));
                stageAll.put("parent", root.get("id"));
                stageAll.put("NodeType", "Node_Stage");
                stageAll.put("icon", "DojoTree_Icon_Node_Stage");
                items.add(stageAll);

                for (DeducePointEntity pt : pointList) {
                        JSONObject json = new JSONObject();
                        json.put("id", pt.getId());
                        json.put("MC", pt.getName());
                        json.put("checked", isCheck);
                        json.put("treeId", json.get("id"));
                        json.put("parent", stageAll.get("id"));
                        json.put("NodeType", "Node_Point");
                        json.put("icon", "DojoTree_Icon_" + json.getString("NodeType") + pt.getType());
                        json.put("lon", pt.getLon());
                        json.put("lat", pt.getLat());
                        json.put("Action", pt.getAction());
                        json.put("Stage", pt.getStage());
                        if (pt.getStage() == null || pt.getStage() == 0) {
                                json.put("parent", stageAll.get("id"));
                        } else if (pt.getStage() == 10) {
                                json.put("parent", stage1.get("id"));
                        } else if (pt.getStage() == 20) {
                                json.put("parent", stage2.get("id"));
                        } else if (pt.getStage() == 30) {
                                json.put("parent", stage3.get("id"));
                        }
                        items.add(json);

                        if (policeList != null && policeList.size() > 0) {
                                List<DeducePoliceEntity> list = policeList.stream()
                                                .filter(o -> o.getGuaId() != null && o.getGuaId().equals(pt.getId()))
                                                .collect(Collectors.toList());
                                if (list != null) {
                                        for (DeducePoliceEntity info : list) {
                                                json = new JSONObject();
                                                json.put("id", info.getId());
                                                json.put("MC", info.getName());
                                                json.put("checked", isCheck);
                                                json.put("treeId", json.get("id"));
                                                json.put("parent", pt.getId());
                                                json.put("lon", pt.getLon());
                                                json.put("lat", pt.getLat());
                                                json.put("PoliceNum",
                                                                StringUtils.hasText(info.getCode()) ? info.getCode()
                                                                                : "");
                                                json.put("PhoneNum",
                                                                StringUtils.hasText(info.getPhone()) ? info.getPhone()
                                                                                : "");
                                                json.put("ZW", StringUtils.hasText(info.getJob()) ? info.getJob() : "");
                                                json.put("Code", info.getCode());
                                                json.put("icon", "DojoTree_Icon_Node_Police");
                                                items.add(json);
                                        }
                                }
                        }
                }

                for (DeduceRegionEntity rg : regionList) {
                        JSONObject json = new JSONObject();
                        json.put("id", rg.getId());
                        json.put("MC", rg.getName());
                        json.put("checked", isCheck);
                        json.put("treeId", json.get("id"));
                        json.put("parent", stageAll.get("id"));
                        json.put("Opacite", rg.getOpacite());
                        json.put("LineColor", rg.getBordercolor());
                        json.put("LineWidth", rg.getBorderwidth());
                        json.put("FillColor", rg.getFillcolor());
                        json.put("Stage", rg.getStage());
                        if (rg.getStage() == null || rg.getStage() == 0) {
                                json.put("parent", stageAll.get("id"));
                        } else if (rg.getStage() == 10) {
                                json.put("parent", stage1.get("id"));
                        } else if (rg.getStage() == 20) {
                                json.put("parent", stage2.get("id"));
                        } else if (rg.getStage() == 30) {
                                json.put("parent", stage3.get("id"));
                        }

                        if (rg.getContent().startsWith("LineString")) {
                                json.put("NodeType", "Node_Line");
                        } else {
                                json.put("NodeType", "Node_Polygon");
                        }
                        json.put("icon", "DojoTree_Icon_" + json.getString("NodeType"));
                        items.add(json);
                }
                return items;
        }

        @Override
        public List<DeduceRegionEntity> getDeduceRegoions(String taskId) {
                QueryWrapper<DeduceRegionEntity> regionWrapper = new QueryWrapper<>();
                regionWrapper.eq("task_id", taskId);
                return this.regionDao.selectList(regionWrapper);
        }

        @Override
        public List<DeducePointEntity> getDeducePoints(String taskId) {
                QueryWrapper<DeducePointEntity> pointWrapper = new QueryWrapper<>();
                pointWrapper.eq("task_id", taskId);

                List<Long> pointIds = new ArrayList<>();
                List<DeducePointEntity> list = this.pointDao.selectList(pointWrapper);
                for (DeducePointEntity point : list) {
                        pointIds.add(point.getId());
                }

                if (pointIds.size() > 0) {
                        QueryWrapper<DeducePoliceEntity> personWrapper = new QueryWrapper<>();
                        personWrapper.in("gua_id", pointIds);
                        List<DeducePoliceEntity> personList = this.policeDao.selectList(personWrapper);
                        if (personList != null && personList.size() > 0) {
                                for (DeducePointEntity point : list) {
                                        List<DeducePoliceEntity> filterList = personList.stream()
                                                        .filter(o -> o.getGuaId() == point.getId().longValue())
                                                        .collect(Collectors.toList());
                                        if (filterList != null && filterList.size() > 0) {
                                                Boolean isFirst = true;
                                                StringBuilder builder = new StringBuilder();
                                                StringBuilder build = new StringBuilder();
                                                for (DeducePoliceEntity person : filterList) {
                                                        if (!isFirst) {
                                                                builder.append("~");
                                                                build.append("~");
                                                        }
                                                        builder.append("姓名：" + person.getName() + ",职务："
                                                                        + person.getJob() + ",联系电话："
                                                                        + person.getPhone() + ",编号："
                                                                        + person.getCode());
                                                        build.append(person.getJob() + "：" + person.getName()
                                                                        + ",电话：<a href=# style=\"color:white;\" onclick=javascript:window.SendCallMsg(\""
                                                                        + person.getPhone() + "\",\"" + person.getName()
                                                                        + "\")>" + person.getPhone()
                                                                        + "</a>");
                                                        isFirst = false;
                                                }
                                                point.setXlry(builder.toString());
                                                point.setShowxlry(build.toString());
                                        }
                                }
                        }
                }
                return list;
        }

        @Override
        public List<DeduceTaskEntity> getDeduceTasks() {
                return this.taskDao.selectList(null);
        }

        @Override
        public Boolean saveRegionInfo(DeduceRegionEntity param) {
                Boolean isOK = false;
                if (param.getId() != null && param.getId() > 0) {
                        DeduceRegionEntity info = this.regionDao.selectById(param.getId());
                        if (info != null) {
                                info.setStage(param.getStage());
                                info.setOpacite(param.getOpacite());
                                info.setFillcolor(param.getFillcolor());
                                info.setName(param.getName());
                                this.fillGeom(info, param.getContent());
                                isOK = this.regionDao.updateById(info) > 0;
                        } else {
                                this.fillGeom(param, param.getContent());
                                isOK = this.regionDao.insert(param) > 0;
                        }
                } else {
                        param.setId(TimeUtils.getIntegerId());
                        this.fillGeom(param, param.getContent());
                        isOK = this.regionDao.insert(param) > 0;
                }
                if (isOK) {
                        if (StringUtils.hasText(param.getPoliceListStr())) {
                                QueryWrapper<DeducePoliceEntity> wrapper = new QueryWrapper<>();
                                wrapper.eq("gua_id", param.getId());
                                this.policeDao.delete(wrapper);

                                String[] xlryArray = param.getPoliceListStr().split("~");
                                if (xlryArray != null && xlryArray.length > 0) {
                                        for (String oneMan : xlryArray) {
                                                if (StringUtils.hasText(oneMan)) {
                                                        String[] infoArray = oneMan.split(",");
                                                        if (infoArray != null && infoArray.length > 0) {
                                                                DeducePoliceEntity entity = new DeducePoliceEntity();
                                                                String[] nameArr = infoArray[0].split("：");
                                                                if (nameArr.length == 2) {
                                                                        entity.setName(nameArr[1]);
                                                                }
                                                                String[] jobArr = infoArray[1].split("：");
                                                                if (jobArr.length == 2) {
                                                                        entity.setJob(jobArr[1]);
                                                                }
                                                                String[] phoneArr = infoArray[2].split("：");
                                                                if (phoneArr.length == 2) {
                                                                        entity.setPhone(phoneArr[1]);
                                                                }
                                                                String[] codeArr = infoArray[3].split("：");
                                                                if (codeArr.length == 2) {
                                                                        entity.setCode(codeArr[1]);
                                                                }
                                                                entity.setId(TimeUtils.getIntegerId());
                                                                entity.setTaskId(param.getTaskId());
                                                                entity.setGuaId(param.getId());
                                                                this.policeDao.insert(entity);
                                                        }
                                                }
                                        }
                                }
                        }
                }
                return isOK;
        }

        @Override
        public Boolean saveRegionEdit(Long regionId, String taskId, String content) {

                String[] arrLONLAT = content.split("\\|");
                if (arrLONLAT.length == 2) {
                        if ("Point".equals(arrLONLAT[0])) {
                                String[] arr = arrLONLAT[1].split("\\,");
                                if (arr.length == 2) {
                                        DeducePointEntity info = this.pointDao.selectById(regionId);
                                        if (info != null) {
                                                info.setLon(Double.parseDouble(arr[0]));
                                                info.setLat(Double.parseDouble(arr[1]));
                                                return this.pointDao.updateById(info) > 0;
                                        }
                                }
                        } else {
                                DeduceRegionEntity entity = new DeduceRegionEntity();
                                if (regionId > 0) {
                                        DeduceRegionEntity info = this.regionDao.selectById(regionId);
                                        if (info != null) {
                                                info.setTaskId(taskId);
                                                info.setContent(content);
                                                return this.regionDao.updateById(info) > 0;
                                        }
                                } else {
                                        entity.setId(TimeUtils.getIntegerId());
                                }
                                entity.setTaskId(taskId);
                                entity.setContent(content);
                                return this.regionDao.insert(entity) > 0;
                        }
                }

                return false;
        }

        @Override
        public Boolean savePointInfo(DeducePointEntity param) {
                Boolean isOK = false;
                if (param.getId() != null && param.getId() > 0) {
                        DeducePointEntity info = this.pointDao.selectById(param.getId());
                        if (info != null) {
                                this.fillSourceByTarget(param, info);
                                isOK = this.pointDao.updateById(info) > 0;
                        } else {
                                isOK = this.pointDao.insert(param) > 0;
                        }
                } else {
                        param.setId(TimeUtils.getIntegerId());
                        isOK = this.pointDao.insert(param) > 0;
                }
                if (isOK) {
                        if (StringUtils.hasText(param.getXlry())) {
                                QueryWrapper<DeducePoliceEntity> wrapper = new QueryWrapper<>();
                                wrapper.eq("gua_id", param.getId());
                                this.policeDao.delete(wrapper);

                                String[] xlryArray = param.getXlry().split("~");
                                if (xlryArray != null && xlryArray.length > 0) {
                                        for (String oneMan : xlryArray) {
                                                if (StringUtils.hasText(oneMan)) {
                                                        String[] infoArray = oneMan.split(",");
                                                        if (infoArray != null && infoArray.length > 0) {
                                                                DeducePoliceEntity entity = new DeducePoliceEntity();
                                                                String[] nameArr = infoArray[0].split("：");
                                                                if (nameArr.length == 2) {
                                                                        entity.setName(nameArr[1]);
                                                                }
                                                                String[] jobArr = infoArray[1].split("：");
                                                                if (jobArr.length == 2) {
                                                                        entity.setJob(jobArr[1]);
                                                                }
                                                                String[] phoneArr = infoArray[2].split("：");
                                                                if (phoneArr.length == 2) {
                                                                        entity.setPhone(phoneArr[1]);
                                                                }
                                                                String[] codeArr = infoArray[3].split("：");
                                                                if (codeArr.length == 2) {
                                                                        entity.setCode(codeArr[1]);
                                                                }
                                                                entity.setId(TimeUtils.getIntegerId());
                                                                entity.setTaskId(param.getTaskId());
                                                                entity.setGuaId(param.getId());
                                                                this.policeDao.insert(entity);
                                                        }
                                                }
                                        }
                                }
                        }
                }
                return isOK;
        }

        @Override
        public Boolean saveTaskInfo(DeduceTaskEntity param) {
                Boolean isOK = false;
                if (StringUtils.hasText(param.getId())) {
                        DeduceTaskEntity info = this.taskDao.selectById(param.getId());
                        if (info != null) {
                                isOK = this.taskDao.updateById(param) > 0;
                        } else {
                                isOK = this.taskDao.insert(param) > 0;
                        }
                } else {
                        param.setId(TimeUtils.getTimeId());
                        isOK = this.taskDao.insert(param) > 0;
                }
                return isOK;
        }

        @Override
        public Boolean deleteDeduceTask(String taskId) {
                return this.taskDao.deleteById(taskId) > 0;
        }

        @Override
        public Boolean deleteDeducePoint(String id) {
                return this.pointDao.deleteById(id) > 0;
        }

        @Override
        public Boolean deleteDeduceRegion(String id) {
                return this.regionDao.deleteById(id) > 0;
        }

        /*
         * 以第一个实体类为主，如果第一个的实体类某个字段为空，则会吧第二个实体类的值取过来进行赋值，
         * 如果不为空的则不作改变
         */
        private JSONObject fillSourceByTarget(DeducePointEntity sourceBean, DeducePointEntity targetBean) {
                Class<? extends DeducePointEntity> sourceBeanClass = sourceBean.getClass();
                Class<? extends DeducePointEntity> targetBeanClass = targetBean.getClass();
                JSONObject editObj = new JSONObject();

                Field[] sourceFields = sourceBeanClass.getDeclaredFields();
                Field[] targetFields = targetBeanClass.getDeclaredFields();
                for (int i = 0; i < sourceFields.length; i++) {
                        Field sourceField = sourceFields[i];
                        if (Modifier.isStatic(sourceField.getModifiers())) {
                                continue;
                        }
                        Field targetField = targetFields[i];
                        if (Modifier.isStatic(targetField.getModifiers())) {
                                continue;
                        }
                        sourceField.setAccessible(true);
                        targetField.setAccessible(true);
                        try {
                                if (!"serialVersionUID".equals(sourceField.getName().toString())
                                                && !(sourceField.get(sourceBean) == null)
                                                && !sourceField.get(sourceBean).equals(targetField.get(targetBean))) {
                                        editObj.put(sourceField.getName().toString(), targetField.get(targetBean));
                                        sourceField.set(targetBean, targetField.get(sourceBean));
                                }
                        } catch (IllegalArgumentException | IllegalAccessException e) {
                                e.printStackTrace();
                        }
                }
                return editObj;
        }

        private void fillGeom(DeduceRegionEntity info, String regionContent) {
                if (StringUtils.hasText(regionContent)) {
                        String[] arrLONLAT = regionContent.split("\\|");
                        if (arrLONLAT.length == 2) {
                                PGgeometry pg = new PGgeometry();
                                if ("Point".equals(arrLONLAT[0])) {
                                        String[] arr = arrLONLAT[1].split(",");
                                        if (arr.length == 2) {
                                                Point point = new Point(Double.parseDouble(arr[0]),
                                                                Double.parseDouble(arr[1]));
                                                pg.setGeometry(point);
                                        }
                                } else if ("LineString".equals(arrLONLAT[0])) {
                                        String[] arr = arrLONLAT[1].split("\\,");
                                        Integer i = 0;
                                        Point[] points = new Point[arr.length / 2];
                                        for (Integer num = 0; num < arr.length; num++) {
                                                Point point = new Point(Double.parseDouble(arr[num]),
                                                                Double.parseDouble(arr[num + 1]));
                                                num++;
                                                points[i] = point;
                                                i++;
                                        }
                                        LineString line = new LineString(points);
                                        pg.setGeometry(line);
                                } else if ("Polygon".equals(arrLONLAT[0])) {
                                        String[] arr = arrLONLAT[1].split("\\,");
                                        Integer i = 0;
                                        Point[] points = new Point[arr.length / 2];
                                        for (Integer num = 0; num < arr.length; num++) {
                                                Point point = new Point(Double.parseDouble(arr[num]),
                                                                Double.parseDouble(arr[num + 1]));
                                                num++;
                                                points[i] = point;
                                                i++;
                                        }
                                        LinearRing[] rings = new LinearRing[1];
                                        rings[0] = new LinearRing(points);
                                        Polygon polygon = new Polygon(rings);
                                        pg.setGeometry(polygon);
                                }
                                // info.setGeom(pg);
                        }
                }
        }

}