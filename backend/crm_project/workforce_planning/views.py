from django.shortcuts import render

from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, Project, Role, Position, Department
from .serializers import UserSerializer, ProjectSerializer, PositionSerializer, DepartmentSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Count, Q

# Register user view
class RegisterUserView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data, 'status': status.HTTP_201_CREATED})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login user view
class LoginUserView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if the user exists in the User table
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'status': status.HTTP_200_OK
        })
        # Extract email and password from the request
        email = request.data.get('email')
        password = request.data.get('password')
        # Authenticate the user with email and password
        user = authenticate(email=email, password=password)
        if user:
            # Create JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Get CFO list
class GetCFOListAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated
    
    def get(self, request):
        # Retrieve the authenticated user from the token
        user = request.user
        
        # Check if the user's role is "CEO"
        if user.role_id.name != 'CEO':
            return Response({"detail": "You do not have permission to view the CFO list.", "status": status.HTTP_403_FORBIDDEN})
        
        # If user is CEO, filter users with the "CFO" role
        cfo_role = Role.objects.get(name="CFO")  # Get the CFO role object
        
        # Retrieve users who have the "CFO" role
        cfo_users = User.objects.filter(role_id=cfo_role)
        
        # Serialize the list of CFO users
        serializer = UserSerializer(cfo_users, many=True, context={'request': request})
        
        return Response({"data": serializer.data, "status": status.HTTP_200_OK})

# Project view (Example)
class ProjectView(views.APIView):
    # Apply authentication
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the user id from the authenticated request (from the token)
        user_id = request.user.id
        
        # Filter the projects where 'created_by' is the current user
        projects = Project.objects.filter(
            Q(created_by_id=user_id) | Q(co_planner_id=user_id)  # Check if user is either 'created_by' or 'co_planner'
        ).annotate(position_count=Count('position'))
        
        # If no projects are found, return a 404 response
        if not projects:
            return Response({"message": "No projects found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the filtered projects
        serializer = ProjectSerializer(projects, many=True)
        
        # Return the response with the serialized data and a 200 OK status
        return Response({'data': serializer.data, 'status':status.HTTP_200_OK})

class ProjectCreateAPIView(views.APIView):
    # Apply authentication and authorization
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Retrieve the authenticated user
        user = request.user
        
        # Check if the user's role is "CEO"
        if user.role_id.name != 'CEO':  # Assuming 'role_id' is a ForeignKey to the 'Role' model
            return Response({"detail": "You do not have permission to create a project."}, status=status.HTTP_403_FORBIDDEN)

        # Copying request data and adding user information
        data = request.data.copy()
        data['created_by_id'] = user.id  # Set the 'created_by' field
        data['updated_by_id'] = user.id  # Set the 'updated_by' field
        
        # Extract project name from the request
        project_name = data.get('name')
        
        # Check if a project with the same name already exists for the current user
        existing_project = Project.objects.filter(name=project_name, created_by_id=user.id).first()

        if existing_project:
            # If the project already exists, update it with the new data
            existing_project.project_description = data.get('project_description', existing_project.project_description)
            existing_project.project_budget = data.get('project_budget', existing_project.project_budget)
            existing_project.updated_by_id = user.id  # Update 'updated_by' field
            
            # Save the updated project
            existing_project.save()
            
            # Serialize the updated project and return the response
            serializer = ProjectSerializer(existing_project, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        else:
            # If the project does not exist, create a new one
            serializer = ProjectSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                # Save the new project to the database
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # If the data is invalid, return the errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ProjectDetailByIdAPIView(views.APIView):
    # Apply authentication
    permission_classes = [IsAuthenticated]    
    def get(self, request, project_id):
        # Check if the project exists and belongs to the current user
        try:
            project = Project.objects.get(id=project_id, created_by_id=request.user.id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize and return project data
        serializer = ProjectSerializer(project, context={'request': request})
        return Response({'data': serializer.data, 'status': status.HTTP_200_OK})

class ProjectUpdateByIdAPIView(views.APIView):
    # Apply authentication
    permission_classes = [IsAuthenticated]    
    def put(self, request, project_id):
        # Check if the project exists and belongs to the current user
        try:
            project = Project.objects.get(id=project_id, created_by_id=request.user.id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize and validate the data
        serializer = ProjectSerializer(project, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(updated_by_id=request.user.id)  # Update the 'updated_by' field
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDeleteByIdAPIView(views.APIView):
    # Apply authentication
    permission_classes = [IsAuthenticated]    
    def delete(self, request, project_id):
        # Check if the project exists and belongs to the current user
        try:
            project = Project.objects.get(id=project_id, created_by_id=request.user.id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the project
        project.delete()
        return Response({"detail": "Project deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class CreatePositionAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated
    
    def post(self, request):
        # Retrieve the authenticated user
        user = request.user
        
        # Check if the user's role is either "CFO" or "CEO"
        if user.role_id.name not in ['CFO', 'CEO']:
            return Response({"detail": "You do not have permission to create a position."}, status=status.HTTP_403_FORBIDDEN)
        
        # Extract the designation and updated_by_id from the request data
        designation = request.data.get('designation')
        updated_by_id = user.id
        
        # Check if a Position already exists with the same designation and updated_by_id
        existing_position = Position.objects.filter(designation=designation, updated_by_id=updated_by_id).first()
        
        if existing_position:
            # If the position exists, update the existing position
            serializer = PositionSerializer(existing_position, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()  # Update the existing position with new data
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no existing position, create a new one
            serializer = PositionSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()  # Save the new position
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UpdatePositionAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated
    
    def put(self, request, pk):
        # Retrieve the authenticated user
        user = request.user
        
        # Check if the user's role is either "CFO" or "CEO"
        if user.role_id.name not in ['CFO', 'CEO']:
            return Response({"detail": "You do not have permission to update this position."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            position = Position.objects.get(id=pk)  # Fetch the position by ID
        except Position.DoesNotExist:
            return Response({"detail": "Position not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize and update the position
        serializer = PositionSerializer(position, data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()  # Save the updated position
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAllPositionsByProjectAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get(self, request):
        # Retrieve the project_id from query parameters
        project_id = request.query_params.get('project_id')
        
        # if not project_id:
        #     return Response({"detail": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)
                # Filter the projects where 'created_by' is the current user
        projects = Project.objects.filter(
            Q(updated_by_id=request.user.id) | Q(co_planner_id=request.user.id)
        )
        # If no projects are found, return a 404 response
        if not projects:
            return Response({"message": "No projects found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter positions by project_id and updated_by_id (authenticated user)
        positions = Position.objects.filter(project_id=project_id)

        if not positions:
            return Response({"detail": "No positions found for this project and user."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the list of positions
        serializer = PositionSerializer(positions, many=True)
        
        # Return the serialized data in a response
        return Response(serializer.data, status=status.HTTP_200_OK)
class GetAllPositionsAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get(self, request):
        # Filter the positions where the updated_by_id matches the authenticated user's ID
        positions = Position.objects.filter(updated_by_id=request.user.id)
        
        if not positions:
            return Response({"detail": "No positions found for this user."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the list of positions
        serializer = PositionSerializer(positions, many=True)
        
        # Return the serialized data in a response
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeletePositionAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def delete(self, request, id):
        # Retrieve the authenticated user
        user = request.user
        
        # Check if the user's role is either "CFO" or "CEO"
        if user.role_id.name not in ['CFO', 'CEO']:
            return Response({"detail": "You do not have permission to delete a position."}, status=status.HTTP_403_FORBIDDEN)
        
        # Try to fetch the Position by ID
        try:
            position = Position.objects.get(id=id)
            print('hellllllllllllllllllllllll', position)
        except Position.DoesNotExist:
            return Response({"detail": "Position not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the position
        position.delete()
        return Response({"detail": "Position deleted successfully."}, status=status.HTTP_200_OK)

class DepartmentListView(views.APIView):
    def get(self, request):
        # Get all departments from the database
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response({'data': serializer.data, 'status': status.HTTP_200_OK})
