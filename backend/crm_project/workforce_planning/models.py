from django.db import models
import uuid

# Role Table
class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

# Department Table
class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# User Table
class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    department_id = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_authenticated(self):
        return True  # Always consider the user as authenticated

    @property
    def is_active(self):
        return True  # Indicate the user is active (if needed by permissions)

    @property
    def is_staff(self):
        return False  # Optional: Set staff status as needed

    def __str__(self):
        return self.email

# Project Table
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    project_description = models.TextField()
    project_budget = models.DecimalField(max_digits=15, decimal_places=2)
    co_planner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='co_planner_projects')  # One co-planner per project
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_projects')

    def __str__(self):
        return self.name



# Position Table
class Position(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project_id = models.ForeignKey('Project', on_delete=models.CASCADE)
    designation = models.CharField(max_length=255)
    department_id = models.ForeignKey('Department', on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=15, decimal_places=2)
    location = models.CharField(max_length=255)
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Position: {self.designation} at {self.project_id.name}"


# adding departments
# INSERT INTO workforce_planning_department (id, name) VALUES 
# ('123e4567-e89b-12d3-a456-426614174002', 'Engineering');

# INSERT INTO workforce_planning_department (id, name) VALUES 
# ('123e4567-e89b-12d3-a456-426614174302', 'Product');

# INSERT INTO workforce_planning_department (id, name) VALUES 
# ('123e4567-e89b-12d3-a456-426614174011', 'Sales');

# INSERT INTO workforce_planning_department (id, name) VALUES 
# ('123e4567-e89b-12d3-a456-426614174888', 'Others');

# role
# INSERT INTO workforce_planning_role (id, name) VALUES 
# ('167e4567-e89b-12d3-a456-426614174888', 'CFO');