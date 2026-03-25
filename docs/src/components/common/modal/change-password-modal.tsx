import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { IUser } from "@/apis/client/auth" 

export function ChangePasswordModal({
    passwordModalOpen,
    setPasswordModalOpen,
    // user,
    loading,
    handleChangePassword,
}: {
    passwordModalOpen: boolean
    setPasswordModalOpen: (open: boolean) => void
    user: Partial<Omit<IUser, "id" | "username">> 
    loading: boolean
    handleChangePassword: () => void
}) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = () => {
        // Add validation (e.g., newPassword === confirmPassword)
        handleChangePassword()
        setPasswordModalOpen(false)
    }

    return (
        <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={() => setPasswordModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="cursor-pointer">
                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}