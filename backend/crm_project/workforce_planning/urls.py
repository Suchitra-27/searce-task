from django.urls import path
from . import views

urlpatterns = [
    path('register', views.RegisterUserView.as_view(), name='register'),

    path('login', views.LoginUserView.as_view(), name='login'),
    path('cfo-list', views.GetCFOListAPIView.as_view(), name='get_cfo_list'),
    path('projects', views.ProjectView.as_view(), name='project-list'),
    path('projects/<uuid:project_id>', views.ProjectDetailByIdAPIView.as_view(), name='get_project'),
    path('projects/create', views.ProjectCreateAPIView.as_view(), name='project-create'),
    path('projects/update/<uuid:project_id>', views.ProjectUpdateByIdAPIView.as_view(), name='update_project'),
    path('projects/delete/<uuid:project_id>', views.ProjectDeleteByIdAPIView.as_view(), name='delete_project'),

    path('position/create', views.CreatePositionAPIView.as_view(), name='create_position'),
    path('position/update/<uuid:pk>/', views.UpdatePositionAPIView.as_view(), name='update_position'),
    path('position', views.GetAllPositionsByProjectAPIView.as_view(), name='get_position'),
    path('position/get_all_position', views.GetAllPositionsAPIView.as_view(), name='get_all_postion'),
    path('delete-position/<uuid:id>', views.DeletePositionAPIView.as_view(), name='delete-position'),

    path('departments', views.DepartmentListView.as_view(), name='department-list'),
    # Add more routes as needed
]
