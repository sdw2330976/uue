package lab.uue.rpt.web.action;

import lab.uue.core.annotation.MetaData;
import lab.uue.core.service.BaseService;
import lab.uue.core.web.BaseController;
import lab.uue.rpt.entity.ReportParam;
import lab.uue.rpt.service.ReportDefService;
import lab.uue.rpt.service.ReportParamService;

import org.apache.struts2.rest.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;

@MetaData(title = "报表参数管理")
public class ReportParamController extends BaseController<ReportParam, String> {

    @Autowired
    private ReportParamService reportParamService;

    @Autowired
    private ReportDefService reportDefService;

    @Override
    protected BaseService<ReportParam, String> getEntityService() {
        return reportParamService;
    }

    @Override
    protected void checkEntityAclPermission(ReportParam entity) {
        // TODO Add acl check code logic
    }

    @Override
    @MetaData(title = "创建")
    public HttpHeaders doCreate() {
        String reportDefId = this.getRequiredParameter("reportDefId");
        bindingEntity.setReportDef(reportDefService.findOne(reportDefId));
        return super.doCreate();
    }

    @Override
    @MetaData(title = "更新")
    public HttpHeaders doUpdate() {
        return super.doUpdate();
    }

    @Override
    @MetaData(title = "删除")
    public HttpHeaders doDelete() {
        return super.doDelete();
    }

    @Override
    @MetaData(title = "查询")
    public HttpHeaders findByPage() {
        return super.findByPage();
    }

    @Override
    public void prepareCreate() {
        super.prepareCreate();
        bindingEntity.setCode("RPT_");
    }
}